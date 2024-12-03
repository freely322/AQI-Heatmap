import numpy as np
import random as random
from scipy.interpolate import griddata
from scipy.interpolate import SmoothSphereBivariateSpline
import matplotlib.pyplot as plt
import requests
import json
import math
from pyproj import Proj
p = Proj('epsg:4214')

URL = "https://partner.yourairtest.com/api/v1/bbox_data/"

PARAMS = {
    'ne_lon': 180,
    'ne_lat': 90,
    'sw_lon': 180,
    'sw_lat': 90,
    'aqi_standart_id': 'us'
}

HEADERS = {
    'x-monair-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoxMSwic29pbCI6IjZhZjdmZTI1OWM5MDRiZDM4Yzg0M2JjNTJjNjI3NmQ2In0.mtw_7yluOpJC-SQRXYa9Cwx42TFlG6x5R0SZjE2bVbt1e30bsi_0ojKyTyLINXB8dSCgOVH6hp7XQhyEPLJbLKYBwPy0ZgLPv3aEl9fpgdgudtIUJAq_Gh4NoCaN7Sckt7OrTzpoSfx6mSQqNo8R0lYKDOB4fZSGJxmEMC6qqH8FWYJ3uz9o-5QuHCQZUOkeboNjwW6IVrPvnVQN1_IMYrNwSQm_xK_2tV-20jH9syGzh7n7BhnoCymem4ojjhquMvT6iq7hXHawcmBMrIThhTixrufCxSRRelOJtVHilMHj62TDetRCPTbCE14jH6Pxb-zVq7QE2ZrnEsSVUX9QfMhB5STateZIODgVkQn1I3Umvm4Cms1VVnVVBlEaeylA7Jz6uZToJlRC2ifxZD2BBtG_DKKnq5dj3MeBUOk4nKuFJ4I0nC7EvPD6k-RiFwpt2aImtGT6bM6D55HDnY725cJyv4pIrTtizySWUOEyHTFW42Io57wuWwmhxEE2YstgdnLR26hRBsH2PnDf1E9mM02q0m4O42tS335lGOjDnBBb_g37S6COR9Fi__LtWGfW1_VDbykvRmI1UCFwQ8HlafktJC13uO2DX8keZyLzkQd9KEOqLMYMtoTl4j8mm8MLC2xmg0MKDbYuyrWxEKiqo49aZg1eJ2hhyJWoCSuwQCU',
    'x-api-key': 'iWCpsNVz.shTf7Oyg70yo20qJ4MG29IxweodQ4Uap',
    'Accept': 'application/json; version=1.0.1'
}

r = requests.get(url = URL, params = PARAMS, headers = HEADERS)

data = r.json()

coordinates = {
    'aqi': [],
    'co': [],
    'o3': [],
    'no2': [],
    'so2': [],
    'pm10': [],
    'pm25': [],
}

radians = {
    'aqi': [],
    'co': [],
    'o3': [],
    'no2': [],
    'so2': [],
    'pm10': [],
    'pm25': [],
}

weights = {
    'aqi': [],
    'co': [],
    'o3': [],
    'no2': [],
    'so2': [],
    'pm10': [],
    'pm25': [],
}

""" minLat = -90
minLon = -180
maxLon = 180
maxLat = 90 """

minLat = 30
minLon = 100
maxLon = 130
maxLat = 40

minRadX = (minLon + 180) * np.pi / 180
minRadY = (minLat + 90) * np.pi / 180
maxRadX = (maxLon + 180) * np.pi / 180
maxRadY = (maxLat + 90) * np.pi / 180

dataLen = len(data)

coordinatesGroupedByPoints = {
    'aqi': {},
    'co': {},
    'o3': {},
    'no2': {},
    'so2': {},
    'pm10': {},
    'pm25': {},
}

for i in range(0, dataLen):
    latLng = np.around(data[i]['station']['location']['coordinates'])
    latLngTuple = (latLng[0], latLng[1])
    if (
        latLng[1] > minLat
        and latLng[1] < maxLat
        and latLng[0] < maxLon
        and latLng[0] > minLon
    ):
        aqi = data[i]['data']['aqi']['value']
        if (aqi != None):
            lens = coordinatesGroupedByPoints.get('aqi')
            if (lens.get(latLngTuple) != None):
                temp = coordinatesGroupedByPoints['aqi'][latLngTuple]
                temp.append(aqi)
                coordinatesGroupedByPoints['aqi'].update([[latLngTuple, temp]])
            else:
                coordinatesGroupedByPoints['aqi'].update([[latLngTuple, [aqi]]])
        pollution = data[i]['data']['pollution']
        for z in pollution:
            if z in coordinatesGroupedByPoints:
                value = data[i]['data']['pollution'][z]['value']
                if (value != None):
                    lens = coordinatesGroupedByPoints.get(z)
                    if (lens.get(latLngTuple) != None):
                        temp = coordinatesGroupedByPoints[z][latLngTuple]
                        temp.append(value)
                        coordinatesGroupedByPoints[z].update([[latLngTuple, temp]])
                    else:
                        coordinatesGroupedByPoints[z].update([[latLngTuple, [value]]])

coordinatesResult = {
    'aqi': [],
    'co': [],
    'o3': [],
    'no2': [],
    'so2': [],
    'pm10': [],
    'pm25': [],
}

for z in coordinatesGroupedByPoints:
    for latLngTuple in coordinatesGroupedByPoints[z]:
        value = coordinatesGroupedByPoints[z].get(latLngTuple)
        if (value != None):
            weight = np.sum(value) / len(value)
            coordinatesResult[z].append({
                'latLng': [latLngTuple[0], latLngTuple[1]],
                'weight': weight
            })

for z in coordinatesResult:
    for point in coordinatesResult[z]:
        latLng = point['latLng']
        radiansLon = (latLng[0] + 180) * np.pi / 180
        radiansLat = (latLng[1] + 90) * np.pi / 180
        weight = point['weight']
        coordinates[z].append(latLng)
        radians[z].append([radiansLat, radiansLon])
        weights[z].append(weight)

""" for i in range(0, dataLen):
    progress = i * 100 / dataLen
     """""" print(chr(27) + "[2J")
    print('Progress: ', math.ceil(progress), '%', '\n')
    print('[', '|' * math.ceil(progress), ' ' * (100 - math.floor(progress)), ']', '\n')  """"""
    latLng = np.around(data[i]['station']['location']['coordinates'])
    if (
        latLng[1] > minLat
        and latLng[1] < maxLat
        and latLng[0] < maxLon
        and latLng[0] > minLon
    ):
        pollution = data[i]['data']['pollution']
        aqi = data[i]['data']['aqi']['value']
        radiansLon = (latLng[0] + 180) * np.pi / 180
        radiansLat = (latLng[1] + 90) * np.pi / 180
        if (
            radiansLon <= np.pi * 2
            and radiansLat <= np.pi
            and radiansLat >= 0
            and radiansLon >= 0
        ):
            coordinates['aqi'].append([latLng[0], latLng[1]])
            radians['aqi'].append([radiansLat, radiansLon])
            weights['aqi'].append(aqi)
            for z in pollution:
                if z in coordinates:
                    value = data[i]['data']['pollution'][z]['value']
                    if (value != None):
                        coordinates[z].append([latLng[0], latLng[1]])
                        radians[z].append([radiansLat, radiansLon])
                        weights[z].append(value) """


def makeOutput(x, y, z):
        data = []
        output = z.tolist()
        minWeight = 0
        for row in range(0, len(output)):
            for column in range(len(output[row])):
                weight = int(z[row][column])
                if weight < minWeight:
                    minWeight = weight

        for row in range(0, len(output)):
            for column in range(len(output[row])):
                weight = float(z[row][column])
                lat = y[row][column] * 180 / np.pi - 90
                lng = x[row][column] * 180 / np.pi - 180
                data.append({
                    'lng': lng,
                    'lat': lat,
                    'weight': weight - minWeight
                })
        return data

def makeOriginalOutput(x, y, z):
        data = []
        output = z.tolist()
        for index in range(0, len(output)):
            weight = float(z[index])
            lat = y[index]
            lng = x[index]
            data.append({
                'lng': lng,
                'lat': lat,
                'weight': weight
            })
        return data

for z in coordinates:
    coordinates[z] = np.array(coordinates[z])
    radians[z] = np.array(radians[z])
    weights[z] = np.array(weights[z])
    grid_x_rad, grid_y_rad = np.mgrid[minRadX:maxRadX:180j, minRadY:maxRadY:90j]

    grid_z0 = griddata(radians[z], weights[z], (grid_y_rad, grid_x_rad), method='nearest', fill_value=0)
    grid_z1 = griddata(radians[z], weights[z], (grid_y_rad, grid_x_rad), method='linear', fill_value=0)
    grid_z2 = griddata(radians[z], weights[z], (grid_y_rad, grid_x_rad), method='cubic', fill_value=0)

    with open(f'data-{z}.json', 'w') as outfile:
        json.dump({
            'ORIGINAL': makeOriginalOutput(coordinates[z][:,0], coordinates[z][:,1], weights[z]),
            'NEAREST': makeOutput(grid_x_rad, grid_y_rad, grid_z0),
            'LINEAR': makeOutput(grid_x_rad, grid_y_rad, grid_z1),
            'CUBIC': makeOutput(grid_x_rad, grid_y_rad, grid_z2)
        }, outfile)


    plt.subplot(221)
    plt.plot(coordinates[z][:,0], coordinates[z][:,1], 'k.', ms=1)
    plt.title('Original')
    plt.subplot(222)
    plt.imshow(grid_z0.T, extent=(0, 2 * np.pi, 0, np.pi), origin='lower')
    plt.title('Nearest')
    plt.subplot(223)
    plt.imshow(grid_z1.T, extent=(0, 2 * np.pi, 0, np.pi), origin='lower')
    plt.title('Linear')
    plt.subplot(224)
    plt.imshow(grid_z2.T, extent=(0, 2 * np.pi, 0, np.pi), origin='lower')
    plt.title('Cubic')
    plt.gcf().set_size_inches(6, 6)
    plt.show()
