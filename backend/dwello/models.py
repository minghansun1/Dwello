# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User as AuthUser


class City(models.Model):
    name = models.CharField(max_length=255)
    state = models.ForeignKey("State", models.DO_NOTHING)
    county = models.CharField(max_length=255, blank=True, null=True)
    lat = models.DecimalField(max_digits=8, decimal_places=6, blank=True, null=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    population = models.BigIntegerField(blank=True, null=True)
    density = models.IntegerField(blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    ranking = models.IntegerField(blank=True, null=True)
    manslaughter_by_negligence = models.IntegerField(blank=True, null=True)
    murder_or_manslaughter = models.IntegerField(blank=True, null=True)
    crime_rate = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "city"


class CityToZipCode(models.Model):
    city_name = models.TextField(blank=True, null=True)
    state_id = models.TextField(blank=True, null=True)
    zip_code = models.ForeignKey(
        "ZipCountyCode", models.DO_NOTHING, db_column="zip_code", blank=True, null=True
    )
    city = models.ForeignKey(City, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "city_to_zip_code"


class CostOfLivingByCounty(models.Model):
    county = models.CharField(
        primary_key=True, max_length=255
    )  # The composite primary key (county, state_id, family_member_count) found, that is not supported. The first column is selected.
    state = models.ForeignKey("State", models.DO_NOTHING)
    lat = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True)
    lng = models.DecimalField(max_digits=7, decimal_places=4, blank=True, null=True)
    population = models.BigIntegerField(blank=True, null=True)
    density = models.IntegerField(blank=True, null=True)
    family_member_count = models.IntegerField()
    housing_cost = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True
    )
    food_cost = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True
    )
    healthcare_cost = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True
    )
    childcare_cost = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True
    )
    taxes = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    total_cost = models.DecimalField(
        max_digits=12, decimal_places=4, blank=True, null=True
    )
    median_family_income = models.DecimalField(
        max_digits=12, decimal_places=4, blank=True, null=True
    )

    class Meta:
        managed = False
        db_table = "cost_of_living_by_county"
        unique_together = (("county", "state", "family_member_count"),)


class HomeDatapoint(models.Model):
    num_homes_sold = models.IntegerField(blank=True, null=True)
    median_sale_price = models.IntegerField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    neighborhood = models.ForeignKey(
        "Neighborhood", models.DO_NOTHING, blank=True, null=True
    )
    median_sale_price_adjusted = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "home_datapoint"


class Industry(models.Model):
    name = models.TextField()
    category = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "industry"


class IndustryCityData(models.Model):
    industry = models.ForeignKey(Industry, models.DO_NOTHING, blank=True, null=True)
    industry_name = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    state_id = models.TextField(blank=True, null=True)
    city = models.ForeignKey(City, models.DO_NOTHING, blank=True, null=True)
    total_employment = models.IntegerField(blank=True, null=True)
    jobs_1000 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    a_mean = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    a_pct10 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    a_pct25 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    a_median = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    a_pct75 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    a_pct90 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    h_mean = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    h_pct10 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    h_pct25 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    h_median = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    h_pct75 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    h_pct90 = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )

    class Meta:
        managed = False
        db_table = "industry_city_data"


class NaturalDisaster(models.Model):
    incident_type = models.TextField()
    date = models.DateField()
    declaration_type = models.TextField(blank=True, null=True)
    state = models.ForeignKey("State", models.DO_NOTHING, blank=True, null=True)
    programs_declared = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "natural_disaster"


class Neighborhood(models.Model):
    name = models.TextField()
    state = models.ForeignKey("State", models.DO_NOTHING, blank=True, null=True)
    city = models.ForeignKey(City, models.DO_NOTHING, blank=True, null=True)
    zip_code = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "neighborhood"


class State(models.Model):
    name = models.CharField(max_length=255)
    state_id = models.CharField(primary_key=True, max_length=2)

    class Meta:
        managed = False
        db_table = "state"


class UserLikesCity(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    city = models.ForeignKey(City, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "user_likes_city"

    class Meta:
        managed = False
        db_table = "user_likes_city"


class UserLikesNeighborhood(models.Model):
    user = models.OneToOneField(
        AuthUser, models.DO_NOTHING, primary_key=True
    )  # The composite primary key (user_id, neighborhood_id) found, that is not supported. The first column is selected.
    neighborhood_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = "user_likes_neighborhood"
        unique_together = (("user", "neighborhood_id"),)


class UserLikesState(models.Model):
    user = models.OneToOneField(
        AuthUser, models.DO_NOTHING, primary_key=True
    )  # The composite primary key (user_id, state_id) found, that is not supported. The first column is selected.
    state = models.ForeignKey(State, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "user_likes_state"
        unique_together = (("user", "state"),)


class UserLikesZipcode(models.Model):
    user = models.OneToOneField(
        AuthUser, models.DO_NOTHING, primary_key=True
    )  # The composite primary key (user_id, zip_code) found, that is not supported. The first column is selected.
    zip_code = models.IntegerField()

    class Meta:
        managed = False
        db_table = "user_likes_zipcode"
        unique_together = (("user", "zip_code"),)


class UserProfile(models.Model):
    user = models.OneToOneField(AuthUser, on_delete=models.CASCADE)
    income = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    city = models.ForeignKey(
        City, on_delete=models.SET_NULL, null=True, blank=True, related_name="residents"
    )

    class Meta:
        db_table = "user_profile"

    def __str__(self):
        return f"{self.user.username}'s Profile"


class ZipCountyCode(models.Model):
    code = models.IntegerField(primary_key=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.ForeignKey(State, models.DO_NOTHING, blank=True, null=True)
    county = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "zip_county_code"
