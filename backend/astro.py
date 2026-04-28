from flask import Flask, request, jsonify
import swisseph as swe
import math

app = Flask(__name__)

# ================================
# 🧠 NAKSHATRA DATA (VEDIC CORE)
# ================================
NAKSHATRAS = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
    "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
    "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
    "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta",
    "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
]

NAKSHATRA_LORDS = [
    "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn"
]

# Vimshottari Dasha sequence
DASHA_SEQUENCE = [
    ("Ketu",7),("Venus",20),("Sun",6),("Moon",10),
    ("Mars",7),("Rahu",18),("Jupiter",16),("Saturn",19),("Mercury",17)
]

# ================================
# 🔮 NAKSHATRA CALCULATION
# ================================
def get_nakshatra(moon_deg):
    index = int(moon_deg / (360 / 27))
    pada = int((moon_deg % (360 / 27)) / (360 / 108)) + 1
    return {
        "nakshatra": NAKSHATRAS[index],
        "lord": NAKSHATRA_LORDS[index % 9],
        "pada": pada
    }

# ================================
# 🔥 SIMPLE DASHA ENGINE (VIMSHOTTARI)
# ================================
def generate_dasha(moon_nakshatra_index):
    sequence = []
    start_index = moon_nakshatra_index % len(DASHA_SEQUENCE)

    for i in range(9):
        planet, years = DASHA_SEQUENCE[(start_index + i) % len(DASHA_SEQUENCE)]
        sequence.append({
            "planet": planet,
            "years": years
        })

    return sequence

# ================================
# 🪐 MAIN API
# ================================
@app.route("/kundali", methods=["POST"])
def kundali():
    data = request.json

    dob = data.get("dob")
    time = data.get("time")
    lat = float(data.get("lat", 28.6139))
    lon = float(data.get("lon", 77.2090))

    try:
        # ================================
        # STEP 1: JULIAN DAY
        # ================================
        y, m, d = map(int, dob.split("-"))
        hh, mm = map(int, time.split(":"))

        jd = swe.julday(y, m, d, hh + mm / 60)

        # ================================
        # STEP 2: PLANETS
        # ================================
        planets = {
            "Sun": swe.calc_ut(jd, swe.SUN)[0][0],
            "Moon": swe.calc_ut(jd, swe.MOON)[0][0],
            "Mars": swe.calc_ut(jd, swe.MARS)[0][0],
            "Mercury": swe.calc_ut(jd, swe.MERCURY)[0][0],
            "Jupiter": swe.calc_ut(jd, swe.JUPITER)[0][0],
            "Venus": swe.calc_ut(jd, swe.VENUS)[0][0],
            "Saturn": swe.calc_ut(jd, swe.SATURN)[0][0],
            "Rahu": swe.calc_ut(jd, swe.MEAN_NODE)[0][0],
            "Ketu": (swe.calc_ut(jd, swe.MEAN_NODE)[0][0] + 180) % 360
        }

        # ================================
        # 🌙 NAKSHATRA (MOON-BASED)
        # ================================
        moon_deg = planets["Moon"]
        nakshatra_data = get_nakshatra(moon_deg)

        # ================================
        # 🔥 VEDIC HOUSES (WHOLE SIGN)
        # ================================
        asc = swe.houses(jd, lat, lon)[1][0]
        asc_sign = int(asc / 30)

        houses = {
            f"House{i+1}": (asc_sign + i) % 12
            for i in range(12)
        }

        # ================================
        # 🔥 VIMSHOTTARI DASHA
        # ================================
        moon_nak_index = int(moon_deg / (360 / 27))
        dasha = generate_dasha(moon_nak_index)

        # ================================
        # FINAL RESPONSE
        # ================================
        return jsonify({
            "planets": planets,
            "houses": houses,
            "ascendant": asc,
            "nakshatra": nakshatra_data,
            "dasha": dasha,
            "system": "Full Vedic Engine (Swiss Ephemeris + Jyotish Layer)"
        })

    except Exception as e:
        return jsonify({
            "error": "Vedic engine failure",
            "details": str(e)
        }), 500


# ================================
# RUN
# ================================
if __name__ == "__main__":
    app.run(port=5002, debug=True)