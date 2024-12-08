export interface ILoginResponse {
    status: number;
    token: string;
}

export interface ILogIn {
    username: string;
    password: string;
}

export interface IBlock {
  block_id: string;
  name: string;
  description: string;
  total_apartment: number;
  total_floor: number;
  floor: IFloor[];
  create_date: string;
  update_date: string;
}

export interface IBlockRequest {
  description: string;
  name: string;
  total_floor: number;
  apartment_per_floor: number
}
  

export interface IFloor {
  floor_id: string;
  floor_number: number;
  floor_type: string;  // 'COMMERCIAL' | 'RESIDENTIAL' | 'TECHNICAL'
  apartments: IApartment[];
  create_date: string;
  update_date: string;
}
  

export interface IApartment {
  furnished: boolean;
  apartment_id: string;
  area: number;
  name: string;
  number_of_bedroom: number;
  number_of_bathroom: number;
  sale_info: ISaleInfo;
  status: string;
  service_details: IServiceDetail[];
  owner: IOwner;
  residents: IResident[];
  create_date: string;
  update_date: string;
}
  
export interface ISaleInfo {
  purchase_price: number;
  sale_date: string;
}
export interface IOwner {
  owner_id: string;
  birth_day: string;
  career: string;
  city: string;
  district: string;
  email: string;
  first_name: string;
  gender: string;
  id_card_number: string;
  household_head: boolean;
  occupancy: boolean;
  last_name: string;
  middle_name: string;
  phone_number: string;
  street: string;
  ward: string;
  create_date: string;
  update_date: string;
  household: {
    household_id: string,
    total_member: number,
  }
}

export interface IResident {
  birth_day: string;
  career: string;
  city: string;
  district: string;
  email: string;
  first_name: string;
  gender: string;
  id_card_number: string;
  household_head: boolean;
  last_name: string;
  middle_name: string;
  phone_number: string;
  ward: string;
  street: string
}
  
export interface IServiceDetail {
  service_detail_id: string;
  amount_of_using: number;
  money: number;
  new_value: number;
  old_value: number;
  service: IService;
  create_date: string;  
  update_date: string; 
}

export interface IService {
  metered_service: boolean;
  service_id: string;
  is_metered_service: boolean;
  name: string;
  price: number;
  unit: string;
  create_date: string; 
  update_date: string;
}
  
export interface IServiceRequest {
  metered_service: boolean;
  service_id: string;
  name: string;
  price: number;
  unit: string;
}

export interface IApartmentRequest {
  floor_id: string; 
  area: number;
  name: string;
  status: string;
  furnished: boolean;
  number_of_bedroom: number;
  number_of_bathroom: number;
  sale_info: {
    purchase_price: number,
  };
}

export interface IRole {
  role_id: string;
  label: string;
  description: string;
}

export interface IUserInfo {
  email: string;
  first: string;
  middle: string;
  last: string;
  prefix: string;
  phone: string;
  country: string;
}

export interface IAccount {
  user_id: string;
  username: string;
  status: string;
  role: IRole;
  user_info: IUserInfo;
  created_at: string;  
  updated_at: string; 
}
export interface IChangePassword {
  user_id: string;
  confirm_password: string;
  new_password: string;
  old_password: string;
}

export interface ICreateInvoice {
  apartment_id: string,
  payment_deadline: Date,
  status: string,
}

export interface IContract {
  contract_id: string;
  start_date: string;
  end_date: string;
  status: string; 
  apartment: IApartment;
  create_date: string;
  update_date: string;
  owner: IOwner;
}

export interface IRenter {
  renter_id: string;
  birth_day: string;
  career: string;
  city: string;
  district: string;
  email: string;
  first_name: string;
  gender: string;
  id_card_number: string;
  household_head: boolean;
  last_name: string;
  middle_name: string;
  phone_number: string;
  street: string;
  ward: string;
  create_date: string;
  update_date: string;
}

export interface IRentalRecord {
  record_id: string;
  owner: {
    owner_id: string;
    birth_day: string;
    career: string;
    city: string;
    district: string;
    email: string;
    first_name: string;
    gender: string;
    id_card_number: string;
    household_head: boolean;
    occupancy: boolean;
    last_name: string;
    middle_name: string;
    phone_number: string;
    street: string;
    ward: string;
    apartment: {
      furnished: boolean;
      apartment_id: string;
      area: number;
      name: string;
      sale_info: {
        purchase_price: number;
        sale_date: string;
      };
      status: string;
      number_of_bedroom: number;
      number_of_bathroom: number;
    };
    household: {
      household_id: string;
      total_member: number;
    };
    create_date: string;
    update_date: string;
  };
  renters: Array<{
    renter_id: string;
    birth_day: string;
    career: string;
    city: string;
    district: string;
    email: string;
    first_name: string;
    gender: string;
    id_card_number: string;
    household_head: boolean;
    last_name: string;
    middle_name: string;
    phone_number: string;
    street: string;
    ward: string;
    create_date: string;
    update_date: string;
  }>;
  start_date: string;
  end_date: string;
  create_date: string;
  update_date: string;
}


export interface IRentalRecordRequest {
  start_date: string;
  end_date: string;
  owner_id: string | undefined;
  renter: IOwnerRequest;
}


export interface IInvoice {
  invoice_id: string;
  payment_deadline: string;
  extra_payment_deadline: string,
  penalty_fee: number,
  status: string;
  total: number;
  apartment: IApartment;
  create_date: string;
  update_date: string;
}

export interface IHousehold {
  household_id: string;
  total_member: number;
  residents: IResident[];
  create_date: string;
  update_date: string;
}

export interface IContractRequest {
  start_date: string; 
  status: string;
  apartment_id: string;
  owner: IOwnerRequest;
}

export interface IOwnerRequest {
  birth_day: string;
  career: string;
  city: string;
  district: string;
  email: string;
  first_name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  id_card_number: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  street: string;
  ward: string;
}

export interface IProvince {
  province_id: string;
  province_name: string;
  province_type: string;
}

export interface IDistrict {
  district_id: string;
  district_name: string;
  district_type: string;
  lat: string;
  lng: string;
  province_id: string;
}

export interface IWard {
  district_id: string;
  ward_id: string;
  ward_name: string;
  ward_type: string;
}

export interface IGetProvinceResponse {
  results: IProvince[];
}

export interface IGetDistrictResponse {
  results: IDistrict[];
}

export interface IGetWardResponse {
  results: IWard[];
}

export interface IHousehold {
  household_id: string;
  total_member: number;
  owners: IOwner[];
  create_date: string;
  update_date: string;
}