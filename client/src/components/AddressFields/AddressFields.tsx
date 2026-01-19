import { FormField } from '../FormField';
import styles from './AddressFields.module.css';

export interface AddressData {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface AddressFieldsProps {
  address: AddressData;
  onChange: (address: AddressData) => void;
}

export function AddressFields({ address, onChange }: AddressFieldsProps) {
  const handleFieldChange = (name: string, value: string) => {
    onChange({ ...address, [name]: value });
  };

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Address</legend>
      <div className={styles.fields}>
        <FormField
          label="Street"
          name="street"
          value={address.street || ''}
          onChange={handleFieldChange}
          placeholder="123 Main St"
        />
        <div className={styles.row}>
          <FormField
            label="City"
            name="city"
            value={address.city || ''}
            onChange={handleFieldChange}
            placeholder="City"
          />
          <FormField
            label="State/Province"
            name="state"
            value={address.state || ''}
            onChange={handleFieldChange}
            placeholder="State"
          />
        </div>
        <div className={styles.row}>
          <FormField
            label="Postal Code"
            name="postalCode"
            value={address.postalCode || ''}
            onChange={handleFieldChange}
            placeholder="12345"
          />
          <FormField
            label="Country"
            name="country"
            value={address.country || ''}
            onChange={handleFieldChange}
            placeholder="Country"
          />
        </div>
      </div>
    </fieldset>
  );
}
