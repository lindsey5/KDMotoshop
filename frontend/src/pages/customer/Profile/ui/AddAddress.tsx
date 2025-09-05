import { MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { useAddress } from "../../../../hooks/useAddress";
import { CustomizedSelect } from "../../../../components/Select";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import Card from "../../../../components/Card";
import { RedButton } from "../../../../components/buttons/Button";

type AddAddressProps = {
  isDark: boolean;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  close: () => void;
};

const AddAddress = ({ isDark, setAddresses, close }: AddAddressProps) => {
    const [newAddress, setNewAddress] = useState<Address>({
        street: "",
        barangay: "",
        city: "",
        region: "",
        firstname: "",
        lastname: "",
        phone: "",
        isDefault: false,
    });

    const {
        selectedCity,
        setSelectedCity,
        selectedRegion,
        setSelectedRegion,
        regions,
        cities,
        barangays,
    } = useAddress();

    const handleAdd = async () => {
    if (
        newAddress.firstname &&
        newAddress.lastname &&
        newAddress.phone &&
        newAddress.street &&
        newAddress.barangay &&
        newAddress.city &&
        newAddress.region
    ) {
        // Show confirmation dialog
        if (await confirmDialog("Save Address", "Are you sure you want to save this address?", isDark)) {
        setAddresses((prev) => [...prev, newAddress]);
        await successAlert("Saved!", "The address has been added successfully.", isDark);
        close();
        }
    } else {
        // Show warning if fields are missing
        await errorAlert(
        "Missing Information",
        "Please complete all required fields before saving.",
        isDark
        );
    }
    };

  const inputStyle = `outline-none w-full px-4 py-3 rounded-lg border transition-all duration-200 
    ${
      isDark
        ? "bg-[#313131] border-gray-400 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
    }`;

  const labelStyle = `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  // ✅ Region change
  const handleRegionChange = (value: string) => {
    const selected = regions.find((region: any) => region.code === value);
    setSelectedRegion(value);
    setSelectedCity(""); // reset city when region changes
    setNewAddress((prev) => ({
      ...prev,
      region: selected ? selected.name : "",
      city: "",
      barangay: "",
    }));
  };

  // ✅ City change
  const handleCityChange = (value: string) => {
    const selected = cities.find((city: any) => city.code === value);
    setSelectedCity(value);
    setNewAddress((prev) => ({
      ...prev,
      city: selected ? selected.name : "",
      barangay: "",
    }));
  };

  // ✅ Barangay change
  const handleBarangayChange = (value: string) => {
    setNewAddress((prev) => ({ ...prev, barangay: value }));
  };

  return (
    <Card className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2 rounded-lg ${isDark ? "bg-red-600/20" : "bg-red-100"}`}>
          <MapPin className={isDark ? "text-red-400" : "text-red-600"} size={20} />
        </div>
        <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          New Address
        </h3>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={newAddress.firstname}
              onChange={(e) =>
                setNewAddress((p) => ({ ...p, firstname: e.target.value }))
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={newAddress.lastname}
              onChange={(e) =>
                setNewAddress((p) => ({ ...p, lastname: e.target.value }))
              }
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Phone Number</label>
            <input
              type="text"
              placeholder="+63 XXX XXX XXXX"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress((p) => ({ ...p, phone: e.target.value }))
              }
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Street Address</label>
            <textarea
              placeholder="House number, street name, building"
              value={newAddress.street}
              onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
              rows={3}
              className={`${inputStyle} resize-none outline-none`}
            />
          </div>

          {/* ✅ Region > City > Barangay */}
          <div className="flex flex-col gap-4">
            <CustomizedSelect
              label="Region"
              value={selectedRegion}
              menu={regions.map((region: any) => ({
                value: region.code,
                label: region.name,
              }))}
              onChange={(e) => handleRegionChange(e.target.value as string)}
            />

            {selectedRegion && (
              <CustomizedSelect
                label="City/Municipality"
                value={selectedCity}
                menu={cities.map((city: any) => ({
                  value: city.code,
                  label: city.name,
                }))}
                onChange={(e) => handleCityChange(e.target.value as string)}
              />
            )}

            {selectedCity && (
              <CustomizedSelect
                label="Barangay"
                value={newAddress.barangay}
                menu={barangays.map((barangay: any) => ({
                  value: barangay,
                  label: barangay,
                }))}
                onChange={(e) => handleBarangayChange(e.target.value as string)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <RedButton 
            onClick={handleAdd}
            sx={{ textTransform: "none" }} 
            startIcon={<Save size={18} />}
        >Save Changes</RedButton>
        <button
          onClick={close}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all duration-200 ${
            isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </Card>
  );
};

export default AddAddress;
