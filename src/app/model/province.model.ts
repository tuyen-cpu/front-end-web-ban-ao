export interface Location {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
}
export interface Province extends Location {
  districts: District[];
}
export interface District extends Location {
  province_code: number;
  wards: [];
}
export interface Ward {
  code: number;
  codename: string;
  district_code: number;
  division_type: string;
  name: string;
}
