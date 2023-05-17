"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import React, {ChangeEvent} from "react";
import {useGoogleMapsScript, Libraries} from "use-google-maps-script";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";

interface AddressSelectProps {
  address?: string;
  onSelectAddress: (
    address: string,
    longitude: number | undefined,
    latitude: number | undefined
  ) => void;
  id: string;
}

const libraries: Libraries = ["places"];

const AddressSelect: React.FC<AddressSelectProps> = ({address, onSelectAddress, id}) => {
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;
  return <ReadySearchBox id={id} address={address} onSelectAddress={onSelectAddress} />;
};

export default AddressSelect;

const ReadySearchBox: React.FC<AddressSelectProps> = ({address, onSelectAddress, id}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: {status, data},
    clearSuggestions,
  } = usePlacesAutocomplete({debounce: 300});
  const findCoordonates = async (address: string) => {
    try {
      const results = await getGeocode({address});
      const {lat, lng} = getLatLng(results[0]);
      return {lat, lng};
    } catch (error) {
      console.log("Error findCoord :", error);
      return {lat: null, lng: null};
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress("", undefined, undefined);
    } else {
      try {
        const {lat, lng} = await findCoordonates(e.target.value);
        if (lat && lng) {
          onSelectAddress(e.target.value, lat, lng);
        } else {
          onSelectAddress("", undefined, undefined);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const {lat, lng} = await findCoordonates(address);
    if (lat && lng) {
      onSelectAddress(address, lat, lng);
    } else {
      onSelectAddress("", undefined, undefined);
    }
  };
  return (
    <>
      {/*  ${
            errors
              ? "border-rose-500 focus:border-rose-500 focus:border-dark"
              : "border-neutral-300"
          }  */}
      <Combobox onSelect={handleSelect} className="">
        <ComboboxInput
          value={value}
          onChange={handleChange}
          disabled={!ready}
          placeholder={address || "Address"}
          className={`form-input
          block 
          w-full 
          rounded-md 
          border-0 
          py-4
          text-gray-900 
          shadow-sm 
          ring-1 
          ring-inset 
          ring-gray-300 
          placeholder:text-gray-400 
          focus:ring-2 
          focus:ring-inset 
          focus:ring-dark
          sm:text-sm 
          sm:leading-6`}
          autoComplete="off"
          required
        />
        <ComboboxPopover className="z-[1000] rounded-lg">
          <ComboboxList>
            {status === "OK" &&
              data.map(({place_id, description}) => (
                <ComboboxOption
                  key={place_id}
                  value={description}
                  className="p-3 bg-white cursor-pointer text-dark"
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </>
  );
};
