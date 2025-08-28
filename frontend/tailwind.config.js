/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#204C41",
        green: "#5BBB7B",
        green_100: "#EEF8F2",
        gray_100: "#6C7278",
        text: "#222222",
      },
      boxShadow: {
        s1: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        s2: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        s3: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fadeInDown': 'fadeInDown 0.5s ease',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
