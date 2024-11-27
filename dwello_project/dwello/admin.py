from django.contrib import admin
from .models import (
    City,County, State, Neighborhood, Industry,
    IndustryCityData, HomeDatapoint, NaturalDisaster,
    ZipCode, UserLikesNeighborhood, UserLikesState, UserLikesZipcode
)

admin.site.register(City)
admin.site.register(County)
admin.site.register(State)
admin.site.register(Neighborhood)
admin.site.register(Industry)
admin.site.register(IndustryCityData)
admin.site.register(HomeDatapoint)
admin.site.register(NaturalDisaster)
admin.site.register(ZipCode)
admin.site.register(UserLikesNeighborhood)
admin.site.register(UserLikesState)
admin.site.register(UserLikesZipcode)