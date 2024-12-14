# Dictionary of SQL queries used by views.py
SQL_QUERIES = {
    "top_liked_neighborhoods": """
        SELECT n.name AS neighborhood_name, COUNT(uln.user_id) AS favorite_count
        FROM Neighborhood n
        JOIN user_likes_neighborhood uln ON n.id = uln.neighborhood_id
        GROUP BY n.id
        ORDER BY favorite_count DESC
        LIMIT %(num)s
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
        neighborhood_score AS (
            SELECT n2.id as id, n2.city_id, n2.state_id, n2.name AS neighborhood_name,
                ABS(CAST(SUM(CAST(hd.median_sale_price_adjusted AS DECIMAL(38, 2)) * hd.num_homes_sold) /
                        NULLIF(SUM(hd.num_homes_sold), 0) AS INT)-%(preferred_median_home_price)s)*%(importance_median_home_price)s AS neighborhood_price_score
            FROM neighborhood n2
            JOIN home_datapoint hd ON n2.id = hd.neighborhood_id
            GROUP BY n2.id
        ),
        city_score AS(
            SELECT name, id, state_id, county,
                SQRT(POWER(lat-%(preferred_latitude)s, 2)+POWER(lng-%(preferred_longitude),2)) * %(importance_location)s AS city_location_score,
                ABS(crime_rate-%(preferred_crime_rate)s) * %(importance_crime_rate)s AS city_crime_rate_score
            FROM city
        ),
        industry_city_score AS(
            SELECT city_id, ABS(a_median-%(preferred_industry_salary)s) * %(importance_industry_salary)s AS city_industry_salary_score,
            ABS(a_median-%(preferred_industry_jobs_1000)s) * %(importance_industry_jobs_1000)s AS city_industry_jobs_1000_score
            FROM industry_city_data
            WHERE industry_name = %(industry_name)s
        ),
        state_score AS(
            SELECT s2.state_id, ABS(COUNT(*)-%(preferred_natural_disaster_count)s) * %(importance_natural_disaster_count)s AS state_natural_disaster_score
            FROM state s2
                    JOIN natural_disaster
                        ON s2.state_id = natural_disaster.state_id
            WHERE date>'2000-01-01'
            GROUP BY s2.state_id
        ),
        county_score AS(
            SELECT county, state_id, ABS(AVG(total_cost)-%(preferred_cost_of_living)s) * %(importance_cost_of_living)s AS county_cost_of_living_score,
            ABS(AVG(median_family_income)-%(preferred_median_family_income)s) * %(importance_median_family_income)s AS county_family_median_income_score
            FROM cost_of_living_by_county
            GROUP BY county, state_id
        )

        SELECT neighborhood_name,
            (neighborhood_price_score+city_location_score+city_crime_rate_score+city_industry_salary_score+city_industry_jobs_1000_score+state_natural_disaster_score) AS total_score
        FROM neighborhood_score n
        JOIN city_score c
            ON n.city_id = c.id
        JOIN industry_city_score i
            ON i.city_id = c.id
        JOIN state_score s
            ON s.state_id=c.state_id
        JOIN county_score co
            ON co.county = c.county
        ORDER BY total_score
        LIMIT %(num)s
    """,

    'high_cost_cities_by_state': """
        SELECT
            c.name AS city_name,
            s.name AS state_name,
            clb.total_cost AS cost_of_living
        FROM
            city c
                JOIN
            state s ON c.state_id = s.state_id
                JOIN
            cost_of_living_by_county clb ON c.county = clb.county AND c.state_id = clb.state_id
        WHERE
            clb.total_cost > (
                SELECT AVG(clb2.total_cost)
                FROM cost_of_living_by_county clb2
                WHERE clb2.state_id = clb.state_id
            )
        ORDER BY
            s.name,
            clb.total_cost DESC
    """,
    "get_user_preferences": """
        SELECT income, location
        FROM auth_user u
        WHERE u.id = %(user_id)s
    """,

        'filter_neighborhoods': """
        WITH neighborhood_filtered AS (
            SELECT n2.name AS neighborhood_name,
                CAST(SUM(CAST(hd.median_sale_price_adjusted AS DECIMAL(38, 2)) * hd.num_homes_sold) /
                NULLIF(SUM(hd.num_homes_sold), 0) AS INT) AS weighted_avg_price,
                n2.id as id
            FROM neighborhood n2
            JOIN home_datapoint hd ON n2.id = hd.neighborhood_id
            WHERE (%(zip_code)s IS NULL OR zip_code = %(zip_code)s)
            GROUP BY n2.id
            HAVING
                CAST(
                SUM(CAST(hd.median_sale_price_adjusted AS DECIMAL(38, 2)) * hd.num_homes_sold) /
                NULLIF(SUM(hd.num_homes_sold), 0)
                AS INT
                ) BETWEEN COALESCE(%(min_price)s, 0) AND COALESCE(%(max_price)s, 100000000)
        ),
        city_filtered AS (
            SELECT id, county, state_id
            FROM city
            WHERE lat BETWEEN COALESCE(%(min_latitude)s,-90) AND COALESCE(%(max_latitude)s,90)
                AND lng BETWEEN COALESCE(%(min_longitude)s,-180) AND COALESCE(%(max_longitude)s,180)
                AND crime_rate < COALESCE(%(max_crime)s, 100000)
                AND density BETWEEN COALESCE(%(min_pop_density)s, 0) AND COALESCE(%(max_pop_density)s, 100000)
                AND population BETWEEN COALESCE(%(min_pop)s, 0) AND COALESCE(%(max_pop)s, 100000000)
                AND (%(city)s IS NULL OR name = %(city)s)
        ),
        state_filtered AS (
            SELECT s.state_id, COUNT(*)
            FROM state s
            JOIN natural_disaster
            ON s.state_id = natural_disaster.state_id
            WHERE date>'2000-01-01' AND (%(state)s IS NULL OR s.state_id=%(state)s)
            GROUP BY s.state_id
            HAVING COUNT(*)>COALESCE(%(max_natural_disaster_count)s, 0)
        ),
        county_filtered AS (
            SELECT county, state_id, AVG(total_cost) as total_cost
            FROM cost_of_living_by_county
            GROUP BY county, state_id
            HAVING AVG(total_cost) BETWEEN COALESCE(%(min_cost_of_living)s, 0) AND COALESCE(%(max_cost_of_living)s, 10000000)
        )

        SELECT nf.id, nf.neighborhood_name, nf.weighted_avg_price, nf.zip_code, cf.id, cf.state_id, cf.county FROM neighborhood n
        JOIN neighborhood_filtered nf
            ON n.id = nf.id
        JOIN city_filtered cf
            ON n.city_id = cf.id
        JOIN state_filtered sf
            ON n.state_id = sf.state_id
        JOIN county_filtered col_f
            ON cf.county = col_f.county AND cf.state_id=col_f.state_id
    """,


    'get_user_favorites': """
        SELECT
            u.id AS user_id,
            c.name AS favorite_city,
            z.code AS favorite_zip_code,
            s.name AS favorite_state,
            n.name AS favorite_neighborhood
        FROM
            auth_user u
                LEFT JOIN
            user_likes_city ulc ON u.id = ulc.user_id
                LEFT JOIN
            city c ON ulc.city_id = c.id
                LEFT JOIN
            user_likes_zipcode ulz ON u.id = ulz.user_id
                LEFT JOIN
            zip_county_code z ON ulz.zip_code = z.code
                LEFT JOIN
            user_likes_state uls ON u.id = uls.user_id
                LEFT JOIN
            state s ON uls.state_id = s.state_id
                LEFT JOIN
            user_likes_neighborhood uln ON u.id = uln.user_id
                LEFT JOIN
            neighborhood n ON uln.neighborhood_id = n.id
        WHERE
            u.id = %(target_user_id)s
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
}
