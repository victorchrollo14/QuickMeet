/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      tablet: { min: "991px" },
      "mobile-landscape": { max: "767px" },
      mobile: { max: "479px" },
    },
    fontFamily: {
      sans: ["Mulish"],
    },
    extend: {
      colors: {
        black: "#25313C",
        "extra-light-grey": "#DAE3EA",
        "light-grey": "#6D7D8B",
        purple: "#811870",
        green: "#188170",
        "off-white": "#efefef",
      },

      fontSize: {
        heading: [
          "2.8125rem",
          {
            lineHeight: "150.6%",
          },
        ],
        paragraph: [
          "1.375rem",
          {
            lineHeight: "150.6%",
          },
        ],
      },
    },
  },

  plugins: [],
};
