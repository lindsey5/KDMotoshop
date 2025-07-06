import { type Dayjs } from 'dayjs';
import {
  DateRangePicker,
  LocalizationProvider,
  type DateRange
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useDarkmode from '../hooks/useDarkmode';

type CustomDateRangePickerProps = {
  value: DateRange<Dayjs> | undefined;
  setValue: React.Dispatch<React.SetStateAction<DateRange<Dayjs> | undefined>>;
}

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  value,
  setValue,
}) => {

  const isDark = useDarkmode();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
};
