import swisseph as swe
import datetime

# set ephemeris path (important)
swe.set_ephe_path('/usr/share/ephe')

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,
    "Ketu": swe.TRUE_NODE
}

SIGNS = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]

def get_zodiac(degree):
    return SIGNS[int(degree / 30)]

def get_planet_positions(date_str, time_str):
    dt = datetime.datetime.fromisoformat(f"{date_str}T{time_str}")

    jd = swe.julday(dt.year, dt.month, dt.day,
                    dt.hour + dt.minute/60)

    result = {}

    for name, planet in PLANETS.items():
        pos, _ = swe.calc_ut(jd, planet)

        longitude = pos[0]
        result[name] = {
            "degree": longitude,
            "sign": get_zodiac(longitude),
            "raw": pos
        }

    return result