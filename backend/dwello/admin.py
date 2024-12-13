from django.contrib import admin
from .models import (
    City,CostOfLivingByCounty, State, Neighborhood, Industry,
    IndustryCityData, HomeDatapoint, NaturalDisaster,
    ZipCountyCode, UserLikesNeighborhood, UserLikesState, UserLikesZipcode
)

admin.site.register(City)
admin.site.register(CostOfLivingByCounty)
admin.site.register(State)
admin.site.register(Neighborhood)
admin.site.register(Industry)
admin.site.register(IndustryCityData)
admin.site.register(HomeDatapoint)
admin.site.register(NaturalDisaster)
admin.site.register(ZipCountyCode)
admin.site.register(UserLikesNeighborhood)
admin.site.register(UserLikesState)
admin.site.register(UserLikesZipcode)