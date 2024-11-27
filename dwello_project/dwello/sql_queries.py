# Dictionary of SQL queries used by views.py
SQL_QUERIES = {
    'top_favorited_neighborhoods': """
        SELECT n.name AS neighborhood_name, COUNT(uln.user_id) AS favorite_count
        FROM Neighborhood n
        JOIN user_likes_neighborhood uln ON n.id = uln.neighborhood_id
        GROUP BY n.id
        ORDER BY favorite_count DESC
        LIMIT %(num)s
    """,

    'neighborhood_price_ranking': """
        SELECT n.name AS neighborhood_name,
               SUM(CAST(hd.median_sale_price AS BIGINT) * CAST(hd.num_homes_sold AS BIGINT)) / 
               NULLIF(SUM(CAST(hd.num_homes_sold AS BIGINT)), 0) AS weighted_avg_price
        FROM neighborhood n
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY n.name
        ORDER BY weighted_avg_price DESC
    """,

    'city_price_ranking': """
        SELECT c.name AS city_name,
               SUM(CAST(hd.median_sale_price AS BIGINT) * CAST(hd.num_homes_sold AS BIGINT)) / 
               NULLIF(SUM(CAST(hd.num_homes_sold AS BIGINT)), 0) AS weighted_avg_price
        FROM city c
        JOIN neighborhood n ON c.id = n.city_id
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY c.name
        ORDER BY weighted_avg_price DESC
    """,

    'preference_based_ranking': """
        WITH avg_cost_of_living AS (
            SELECT 
                county,
                state_id,
                AVG(median_family_income) as median_income,
                AVG(total_cost) as cost_of_living
            FROM cost_of_living_by_county
            GROUP BY county, state_id
        ),
        neighborhood_scores AS (
            SELECT n.id AS neighborhood_id,
                   n.name AS neighborhood_name,
                   ABS(acl.cost_of_living - %(preferred_cost_of_living)s) * %(importance_cost_of_living)s AS cost_of_living_score,
                   ABS(hd.median_sale_price - %(preferred_median_home_price)s) * %(importance_median_home_price)s AS home_price_score,
                   ABS(acl.median_income - %(preferred_median_income)s) * %(importance_median_income)s AS median_income_score,
                   ABS(c.crime_rate - %(preferred_crime_rate)s) * %(importance_crime_rate)s AS crime_score
            FROM neighborhood n
            JOIN home_datapoint hd ON n.id = hd.neighborhood_id
            JOIN zip_county_code zcc ON n.city = zcc.city
            JOIN city c ON n.city_id = c.id
            JOIN avg_cost_of_living acl ON c.county = acl.county
                AND c.state_id = acl.state_id
        )
        SELECT neighborhood_name,
               (cost_of_living_score + home_price_score + median_income_score + crime_score) AS total_score
        FROM neighborhood_scores
        ORDER BY total_score ASC
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

    'get_user_preferences': """
        SELECT income, location
        FROM user u
        WHERE u.id = %(user_id)s
    """,

    'filter_neighborhoods_by_price': """
        SELECT n.name AS neighborhood_name,
               hd.median_sale_price
        FROM neighborhood n
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        WHERE hd.median_sale_price BETWEEN %(min_price)s AND %(max_price)s
        ORDER BY hd.median_sale_price ASC
    """,

    'get_user_favorites': """
        SELECT
            u.id AS user_id,
            c.name AS favorite_city,
            z.code AS favorite_zip_code,
            s.name AS favorite_state,
            n.name AS favorite_neighborhood
        FROM
            user_table u
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

    'count_natural_disasters': """
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

    'find_nearest_cities': """
        SELECT
            c.name AS city_name,
            c.lat,
            c.lng,
            s.name AS state_name,
            (
                6371 * acos(
                        cos(radians($(target_latitude)s)) * cos(radians(c.lat)) *
                        cos(radians(c.lng) - radians($(target_longitude)s)) +
                        sin(radians($(target_latitude)s)) * sin(radians(c.lat))
                    )
                ) AS distance_km
        FROM
            city c
                JOIN
            state s ON c.state_id = s.state_id
        ORDER BY
            distance_km ASC
        LIMIT $(num)s
    """
}
