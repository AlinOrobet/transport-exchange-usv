import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  const getByLabel = (label: string) => {
    return formattedCountries.find((item) => item.label === label);
  };

  return {
    getAll,
    getByValue,
    getByLabel,
  };
};

export default useCountries;
