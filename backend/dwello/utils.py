from django.db import connection
from psycopg2.sql import SQL, Identifier
from .sql_queries import SQL_QUERIES

def execute_query(query_name, params=None):
    with connection.cursor() as cursor:
        if query_name == "user_liked_locations":
            # Handle user_liked_locations query
            query_params = params.copy()
            table_name = query_params.pop('table_name')
            likes_table = query_params.pop('likes_table')
            id_column = query_params.pop('id_column')
            location_id_column = query_params.pop('location_id_column')
            
            sql = SQL(SQL_QUERIES[query_name]).format(
                table_name=Identifier(table_name),
                likes_table=Identifier(likes_table),
                id_column=Identifier(id_column),
                location_id_column=Identifier(location_id_column)
            )
            cursor.execute(sql, query_params)
            
        elif query_name in ["like_location", "unlike_location", "check_if_liked"]:
            # Handle like/unlike/check queries
            query_params = params.copy()
            table_name = query_params.pop('table_name')
            id_column = query_params.pop('id_column')
            
            sql = SQL(SQL_QUERIES[query_name]).format(
                table_name=Identifier(table_name),
                id_column=Identifier(id_column)
            )
            cursor.execute(sql, query_params)
            
        else:
            # Handle all other queries normally
            cursor.execute(SQL_QUERIES[query_name], params or {})
        
        if cursor.description:  # Only fetch if there are results
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return []  # Return empty list for queries with no results (like INSERT/DELETE)