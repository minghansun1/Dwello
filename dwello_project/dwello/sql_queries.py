# Dictionary of SQL queries used by views.py
SQL_QUERIES = {
    'top_favorited_neighborhoods': """
        SELECT n.name AS neighborhood_name, COUNT(f.user_id) AS favorite_count
        FROM Neighborhood n
        JOIN user_likes_neighborhood uln ON n.id = uln.neighborhood_id
        GROUP BY n.id
        ORDER BY favorite_count DESC
        LIMIT %(num)s
    """,

    'neighborhood_price_ranking': """
        SELECT n.name AS neighborhood_name,
               SUM(hd.median_sale_price * hd.num_homes_sold) / SUM(hd.num_homes_sold) AS weighted_avg_price
        FROM neighborhood n
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY n.name
        ORDER BY weighted_avg_price DESC
    """,

    'city_price_ranking': """
        SELECT c.name AS city_name,
               SUM(hd.median_sale_price * hd.num_homes_sold) / SUM(hd.num_homes_sold) AS avg_price
        FROM city c
        JOIN neighborhood n ON c.id = n.city_id
        JOIN home_datapoint hd ON n.id = hd.neighborhood_id
        GROUP BY c.name
        ORDER BY weighted_avg_price DESC
    """,

    'preference_based_ranking': """
        WITH neighborhood_scores AS (
            SELECT n.id AS neighborhood_id,
                   n.name AS neighborhood_name,
                   ABS(z.cost_of_living - %(preferred_cost_of_living)s) * %(importance_cost_of_living)s AS cost_of_living_score,
                   ABS(hd.median_sale_price - %(preferred_median_home_price)s) * %(importance_median_home_price)s AS home_price_score,
                   ABS(z.median_income - %(preferred_median_income)s) * %(importance_median_income)s AS median_income_score,
                   ABS(c.crime - %(preferred_crime_rate)s) * %(importance_crime_rate)s AS crime_score,
                   ABS(i.a_median - %(preferred_industry_income)s) * %(importance_industry_income)s AS industry_income_score
            FROM neighborhood n
            JOIN zip_code z ON n.zip_code_id = z.id
            JOIN city c ON z.city_id = c.id
            JOIN home_datapoint hd ON n.id = hd.neighborhood_id
            JOIN industry i ON c.id = i.city_id
        )
        SELECT neighborhood_name,
               (cost_of_living_score + home_price_score + median_income_score + crime_score + industry_income_score) AS total_score
        FROM neighborhood_scores
        ORDER BY total_score ASC
        LIMIT %(num)s
    """,

    'high_cost_cities_by_state': """
        SELECT c.name AS city_name,
               s.name AS state_name,
               c.cost_of_living
        FROM city c
        JOIN state s ON c.state_id = s.id
        WHERE c.cost_of_living > (
            SELECT AVG(c2.cost_of_living)
            FROM city c2
            WHERE c2.state_id = c.state_id
        )
        ORDER BY s.name, c.cost_of_living DESC
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
        SELECT u.id AS user_id,
               c.name AS favorite_city,
               z.number AS favorite_zip_code,
               s.name AS favorite_state,
               n.name AS favorite_neighborhood
        FROM user u
        LEFT JOIN like l ON u.id = l.user_id
        LEFT JOIN city c ON l.city_id = c.id
        LEFT JOIN zip_code z ON l.zip_code_id = z.id
        LEFT JOIN state s ON l.state_id = s.id
        LEFT JOIN neighborhood n ON l.neighborhood_id = n.id
        WHERE u.id = %(target_user_id)s
    """,

    'count_natural_disasters': """
        SELECT s.name AS state_name,
               COUNT(nd.id) AS disaster_count
        FROM state s
        JOIN natural_disaster nd ON s.id = nd.state_id
        WHERE nd.date >= 2010
        GROUP BY s.name
        ORDER BY disaster_count DESC
    """,

    'find_nearest_cities': """
        SELECT c.name AS city_name,
               c.latitude,
               c.longitude,
               s.name AS state_name,
               (
                   6371 * acos(
                       cos(pi()/180 * %(target_latitude)s) * cos(pi()/180 * c.latitude) *
                       cos(pi()/180 * c.longitude - pi()/180 * %(target_longitude)s) +
                       sin(pi()/180 * %(target_latitude)s) * sin(pi()/180 * c.latitude)
                   )
               ) AS distance_km
        FROM city c
        JOIN state s ON c.state_id = s.id
        ORDER BY distance_km ASC
        LIMIT %(num)s
    """
}
