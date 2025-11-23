import { MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { useAddress } from "../../../../hooks/useAddress";
import { CustomizedSelect } from "../../../../components/Select";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import Card from "../../../../components/Card";
import { RedButton } from "../../../../components/buttons/Button";
import { RedTextField } from "../../../../components/Textfield";
import { updateData } from "../../../../services/api";

type AddAddressProps = {
  customer: Customer;
  isDark: boolean;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  close: () => void;
  addresses: Address[];
};

const AddAddress = ({ customer, isDark, setAddresses, close, addresses }: AddAddressProps) => {
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
          const response = await updateData('/api/customers', { ...customer, addresses })

          if(!response.success){
            await errorAlert('Error', response.message || 'Failed to add address')
            return;
          }

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

  const labelStyle = `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

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

  const handleCityChange = (value: string) => {
    const selected = cities.find((city: any) => city.code === value);
    setSelectedCity(value);
    setNewAddress((prev) => ({
      ...prev,
      city: selected ? selected.name : "",
      barangay: "",
    }));
  };

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
            <RedTextField 
              placeholder="Enter first name"
              value={newAddress.firstname}
              onChange={(e) => setNewAddress((p) => ({ ...p, firstname: e.target.value }))}
              inputProps={{ maxLength: 50 }}
            />
          </div>
          <div>
            <label className={labelStyle}>Last Name</label>
            <RedTextField 
              placeholder="Enter last name"
              value={newAddress.lastname}
              onChange={(e) => setNewAddress((p) => ({ ...p, lastname: e.target.value }))}
              inputProps={{ maxLength: 50 }}
            />
          </div>
          <div>
            <label className={labelStyle}>Phone Number</label>
            <RedTextField 
              type="number"
              placeholder="+63 XXX XXX XXXX"
              value={newAddress.phone}
              onChange={(e) =>{
                const value = e.target.value.slice(0, 13);
                setNewAddress((p) => ({ ...p, phone: value }))
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Street Address</label>
            <RedTextField 
              multiline
              rows={3}
              placeholder="House number, street name, building"
              value={newAddress.street}
              onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
              inputProps={{ maxLength: 100 }}
            />
          </div>

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

            
            <CustomizedSelect
                label="City/Municipality"
                disabled={!selectedRegion}
                value={selectedCity}
                menu={cities.map((city: any) => ({
                  value: city.code,
                  label: city.name,
                }))}
                onChange={(e) => handleCityChange(e.target.value as string)}
            />

            <CustomizedSelect
                label="Barangay"
                disabled={!selectedCity}
                value={newAddress.barangay}
                menu={barangays.map((barangay: any) => ({
                  value: barangay,
                  label: barangay,
                }))}
                onChange={(e) => handleBarangayChange(e.target.value as string)}
            />
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
