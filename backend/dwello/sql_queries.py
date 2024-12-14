# Dictionary of SQL queries used by views.py
SQL_QUERIES = {
    "top_liked_location": """
        SELECT t.name AS location_name, COUNT(ul.user_id) AS favorite_count
        FROM {table_name} t
        JOIN {likes_table} ul ON t.{id_column} = ul.{location_id_column}
        GROUP BY t.{id_column}, t.name
        ORDER BY favorite_count DESC
        LIMIT 100
    """,
    "top_liked_zipcodes": """
        SELECT zcc.code AS zip_code, 
               zcc.city AS city_name,
               zcc.county AS county_name,
               zcc.state_id AS state_id,
               COUNT(ulz.user_id) AS favorite_count
        FROM zip_county_code zcc
        JOIN user_likes_zipcode ulz ON zcc.code = ulz.zip_code
        GROUP BY zcc.code, zcc.city, zcc.county, zcc.state_id
        ORDER BY favorite_count DESC
        LIMIT 100
    """,
    "neighborhood_price_ranking": """
        SELECT n.name AS neighborhood_name,
               SUM(CAST(hd.median_sale_price AS BIGINT) * CAST(hd.num_homes_sold AS BIGINT)) / 
               NULLIF(SUM(CAST(hd.num_homes_sold AS BIGINT)), 0) AS weighted_avg_price
        FROM neighborhood n
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY n.name
        ORDER BY weighted_avg_price DESC
    """,
    "city_price_ranking": """
        SELECT c.name AS city_name,
               SUM(CAST(hd.median_sale_price AS BIGINT) * CAST(hd.num_homes_sold AS BIGINT)) / 
               NULLIF(SUM(CAST(hd.num_homes_sold AS BIGINT)), 0) AS weighted_avg_price
        FROM city c
        JOIN neighborhood n ON c.id = n.city_id
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY c.name
        ORDER BY weighted_avg_price DESC
    """,
    "preference_based_ranking": """
        WITH neighborhood_score AS (
            SELECT n2.id AS id, n2.city_id, n2.state_id, n2.name AS neighborhood_name,
                CAST(SUM(CAST(hd.median_sale_price_adjusted AS NUMERIC(38, 2)) * hd.num_homes_sold) /
                    NULLIF(SUM(hd.num_homes_sold), 0) AS BIGINT) AS median_sale_price_adjusted,
                ABS(CAST(SUM(CAST(hd.median_sale_price_adjusted AS NUMERIC(38, 2)) * hd.num_homes_sold) /
                    NULLIF(SUM(hd.num_homes_sold), 0) AS BIGINT) - %(preferred_median_home_price)s) * %(importance_median_home_price)s AS neighborhood_price_score
            FROM neighborhood n2
            JOIN home_datapoint hd ON n2.id = hd.neighborhood_id
            GROUP BY n2.id
        ),
        city_score AS (
            SELECT name AS city_name, id, state_id, county,
                lat, lng, crime_rate, density, population,
                SQRT(POWER(lat - %(preferred_latitude)s, 2) + POWER(lng - %(preferred_longitude)s, 2)) * %(importance_location)s AS city_location_score,
                ABS(crime_rate - %(preferred_crime_rate)s) * %(importance_crime_rate)s AS city_crime_rate_score,
                ABS(density - %(preferred_population_density)s) * %(importance_population_density)s AS city_population_density_score,
                ABS(population - %(preferred_population)s) * %(importance_population)s AS city_population_score
            FROM city c2
        ),
        industry_city_score AS (
            SELECT city_id, industry_name, a_median, jobs_1000,
                ABS(a_median - %(preferred_industry_salary)s) * %(importance_industry_salary)s AS city_industry_salary_score,
                ABS(a_median - %(preferred_industry_jobs_1000)s) * %(importance_industry_jobs_1000)s AS city_industry_jobs_1000_score
            FROM industry_city_data
            WHERE industry_name = %(industry_name)s
        ),
        state_score AS (
            SELECT s2.state_id, COUNT(*) AS natural_disaster_count,
                ABS(COUNT(*) - %(preferred_natural_disaster_count)s) * %(importance_natural_disaster_count)s AS state_natural_disaster_score
            FROM state s2
            JOIN natural_disaster ON s2.state_id = natural_disaster.state_id
            WHERE date > '2000-01-01'
            GROUP BY s2.state_id
        ),
        county_score AS (
            SELECT county, state_id, AVG(total_cost) AS total_cost_of_living, AVG(median_family_income) AS median_family_income,
                ABS(AVG(total_cost) - %(preferred_cost_of_living)s) * %(importance_cost_of_living)s AS county_cost_of_living_score,
                ABS(AVG(median_family_income) - %(preferred_median_family_income)s) * %(importance_median_family_income)s AS county_family_median_income_score
            FROM cost_of_living_by_county
            GROUP BY county, state_id
        )
        SELECT *
        FROM (
            SELECT DISTINCT ON (neighborhood_name, city_name, state_id)
                neighborhood_name, 
                city_name, 
                s.state_id, 
                median_sale_price_adjusted, 
                co.county, 
                lat, 
                lng, 
                crime_rate, 
                density, 
                population,
                industry_name, 
                a_median, 
                jobs_1000, 
                total_cost_of_living, 
                median_family_income,
                (neighborhood_price_score + city_location_score + city_crime_rate_score + city_industry_salary_score + city_industry_jobs_1000_score + state_natural_disaster_score) AS total_score
            FROM neighborhood_score n
            JOIN city_score c ON n.city_id = c.id
            JOIN industry_city_score i ON i.city_id = c.id
            JOIN state_score s ON s.state_id = c.state_id
            JOIN county_score co ON co.county = c.county
            WHERE (neighborhood_price_score + city_location_score + city_crime_rate_score + city_industry_salary_score + city_industry_jobs_1000_score + state_natural_disaster_score) IS NOT NULL
            ORDER BY neighborhood_name, city_name, state_id, total_score DESC
        ) subquery
        ORDER BY total_score DESC
        LIMIT %(num)s;
    """,
    "high_cost_cities_by_state": """
        WITH state_avg_cost AS (
        SELECT
            state_id,
            AVG(total_cost) AS avg_total_cost
        FROM cost_of_living_by_county
        GROUP BY state_id
        ),
        state_disaster_count AS (
            SELECT
                nd.state_id,
                COUNT(*) AS disaster_count
            FROM natural_disaster nd
            WHERE nd.date > '2000-01-01'
            GROUP BY nd.state_id
        ),
        county_income AS (
            SELECT
                state_id,
                county,
                AVG(median_family_income) AS avg_county_family_income
            FROM cost_of_living_by_county
            GROUP BY state_id, county
        )

        SELECT
            c.name AS city_name,
            s.name AS state_name,
            clb.total_cost AS cost_of_living,
            sac.avg_total_cost AS state_avg_cost_of_living,
            ABS(clb.total_cost - sac.avg_total_cost) AS cost_difference_from_state_avg,
            COALESCE(sdc.disaster_count, 0) AS disasters_since_2000,
            ci.avg_county_family_income AS avg_county_median_family_income
        FROM city c
                JOIN state s ON c.state_id = s.state_id
                JOIN cost_of_living_by_county clb ON c.county = clb.county AND c.state_id = clb.state_id
                JOIN state_avg_cost sac ON s.state_id = sac.state_id
                LEFT JOIN state_disaster_count sdc ON s.state_id = sdc.state_id
                LEFT JOIN county_income ci ON clb.state_id = ci.state_id AND clb.county = ci.county
        WHERE clb.total_cost > sac.avg_total_cost
        ORDER BY
            s.name,
            clb.total_cost DESC;
    """,
    "get_user_income_and_city": """
        SELECT up.income, 
               c.id as city_id,
               c.name as city_name,
               c.state_id
        FROM user_profile up
        LEFT JOIN city c ON up.city_id = c.id
        WHERE up.user_id = %(user_id)s
    """,
    "filter_neighborhoods": """
        WITH neighborhood_filtered AS (
            SELECT n2.name AS neighborhood_name,
                CAST(SUM(CAST(hd.median_sale_price_adjusted AS DECIMAL(38, 2)) * hd.num_homes_sold) /
                NULLIF(SUM(hd.num_homes_sold), 0) AS INT) AS weighted_avg_price,
                n2.city_id, n2.state_id,
                n2.id as id
            FROM neighborhood n2
            JOIN home_datapoint hd ON n2.id = hd.neighborhood_id
            GROUP BY n2.id
            HAVING
                CAST(
                SUM(CAST(hd.median_sale_price_adjusted AS DECIMAL(38, 2)) * hd.num_homes_sold) /
                NULLIF(SUM(hd.num_homes_sold), 0)
                AS INT
                ) BETWEEN COALESCE(%(min_price)s, 0) AND COALESCE(%(max_price)s, 100000000)
        ),
        city_filtered AS (
            SELECT id, name, county, state_id
            FROM city
            WHERE lat BETWEEN COALESCE(%(min_latitude)s, -90) AND COALESCE(%(max_latitude)s, 90)
                AND lng BETWEEN COALESCE(%(min_longitude)s, -180) AND COALESCE(%(max_longitude)s, 180)
                AND crime_rate < COALESCE(%(max_crime)s, 100000)
                AND density BETWEEN COALESCE(%(min_pop_density)s, 0) AND COALESCE(%(max_pop_density)s, 100000)
                AND population BETWEEN COALESCE(%(min_pop)s, 0) AND COALESCE(%(max_pop)s, 100000000)
                AND ((%(city)s IS NULL OR %(city)s = '' OR name = %(city)s))
        ),
        industry_city_filtered AS (
            SELECT city_id, industry_name, a_median, jobs_1000
            FROM industry_city_data
            WHERE industry_name = %(industry_name)s
        ),
        state_filtered AS (
            SELECT s.state_id, COUNT(*)
            FROM state s
            JOIN natural_disaster
            ON s.state_id = natural_disaster.state_id
            WHERE date > '2000-01-01' AND ((%(state)s IS NULL OR %(state)s = '' OR s.state_id = %(state)s))
            GROUP BY s.state_id
            HAVING COUNT(*) < COALESCE(%(max_natural_disaster_count)s, 0)
        ),
        county_filtered AS (
            SELECT county, state_id, AVG(total_cost) as total_cost
            FROM cost_of_living_by_county
            WHERE (%(county)s IS NULL OR %(county)s = '' OR county = %(county)s)
            GROUP BY county, state_id
            HAVING AVG(total_cost) BETWEEN COALESCE(%(min_cost_of_living)s, 0) AND COALESCE(%(max_cost_of_living)s, 10000000)
        ),
        zip_code_filtered AS (
            SELECT zip_code, city_name, state_id
            FROM city_to_zip_code
            WHERE (%(zip_code)s IS NULL OR %(zip_code)s = 0 OR zip_code = %(zip_code)s))

        SELECT DISTINCT ON (nf.neighborhood_name, cf.name, nf.state_id)
        nf.id, nf.neighborhood_name, nf.weighted_avg_price, zf.zip_code, cf.id, cf.state_id, cf.county
        FROM neighborhood_filtered nf
        JOIN city_filtered cf
            ON nf.city_id = cf.id AND nf.state_id = cf.state_id
        JOIN state_filtered sf
            ON nf.state_id = sf.state_id
        JOIN county_filtered col_f
            ON cf.county = col_f.county AND cf.state_id = col_f.state_id
        JOIN zip_code_filtered zf
            ON zf.state_id = cf.state_id AND zf.city_name = cf.name
        JOIN industry_city_filtered icf
            ON icf.city_id = cf.id

        LIMIT COALESCE(%(num)s, 1000)

    """,
    "count_natural_disasters": """
        SELECT
            s.name AS state_name,
            COUNT(nd.id) AS disaster_count
        FROM
            state s
                JOIN
            natural_disaster nd
            ON s.state_id = nd.state_id
        WHERE
            nd.date >= '2010-01-01'
        GROUP BY
            s.name
        ORDER BY
            disaster_count DESC
    """,
    "find_nearest_cities": """
        SELECT
            c.name AS city_name,
            c.lat,
            c.lng,
            s.name AS state_name,
            (
                6371 * acos(
                        cos(radians(%(target_latitude)s)) * cos(radians(c.lat)) *
                        cos(radians(c.lng) - radians(%(target_longitude)s)) +
                        sin(radians(%(target_latitude)s)) * sin(radians(c.lat))
                    )
                ) AS distance_km
        FROM
            city c
                JOIN
            state s ON c.state_id = s.state_id
        ORDER BY
            distance_km ASC
        LIMIT %(num)s;
    """,
    "like_location": """
        INSERT INTO {table_name} (user_id, {id_column})
        VALUES (%(user_id)s, %(location_id)s)
    """,
    "unlike_location": """
        DELETE FROM {table_name}
        WHERE user_id = %(user_id)s
        AND {id_column} = %(location_id)s
    """,
    "check_if_liked": """
        SELECT EXISTS (
            SELECT 1 
            FROM {table_name}
            WHERE user_id = %(user_id)s
            AND {id_column} = %(location_id)s
        )
    """,
    "user_liked_locations": """
        SELECT t.name AS location_name
        FROM {table_name} t
        JOIN {likes_table} ul ON t.{id_column} = ul.{location_id_column}
        WHERE ul.user_id = %(user_id)s
        ORDER BY t.name
    """,
    "user_liked_zipcodes": """
        SELECT zcc.code AS zip_code,
               zcc.city AS city_name,
               zcc.county AS county_name,
               zcc.state_id
        FROM zip_county_code zcc
        JOIN user_likes_zipcode ulz ON zcc.code = ulz.zip_code
        WHERE ulz.user_id = %(user_id)s
        ORDER BY zcc.code
    """,
    "basic_city_snapshot": """
        SELECT name, state_id, ranking,lat, lng, crime_rate, density, population
        FROM city
        WHERE name = %(city_name)s
        AND state_id = %(state_id)s
    """,
    "basic_county_snapshot": """
        SELECT 
            zc.county,
            zc.state_id,
            zc.city,
            col.housing_cost, 
            col.food_cost,
            col.healthcare_cost
        FROM 
            cost_of_living_by_county col
        JOIN 
            zip_county_code zc ON col.county = zc.county
        WHERE 
            zc.county = %(county_name)s
            AND zc.state_id = %(state_id)s
            AND zc.city = %(city_name)s
        LIMIT 1
    """,
    "basic_state_snapshot": """
        SELECT 
            name, 
            (SELECT AVG(crime_rate) FROM city WHERE city.state_id = state.state_id) AS average_crime_rate,
            (SELECT AVG(median_family_income) FROM cost_of_living_by_county WHERE cost_of_living_by_county.state_id = state.state_id) AS average_median_family_income
        FROM 
            state 
        WHERE 
            name = %(state_name)s;
    """,
    "basic_zipcode_snapshot": """
        SELECT 
            zc.code,
            zc.city AS city_name, 
            zc.state_id AS state_id,  
            AVG(col.housing_cost) AS avg_housing_cost 
        FROM 
            cost_of_living_by_county col
        JOIN 
            zip_county_code zc ON col.county = zc.county
        WHERE 
            zc.code = %(zip_code)s
        GROUP BY 
            zc.code;
    """
}
