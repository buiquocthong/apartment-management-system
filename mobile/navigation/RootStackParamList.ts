import { NavigatorScreenParams } from '@react-navigation/native';
import { IAccount, IApartment, IBlock, IContractRequest, IInvoice, IOwner, IRentalRecordRequest, IRenter, IService } from '../utils/type';

export type RootStackParamList = {
  Home: {};
  Block:{};
  Invoice: {};
  Service: {};
  Contract: {};
  Resident: {};
  Account: {};
  Login: {};
  NotificationScreen: {};
  EditAccountScreen: {account: IAccount};
  ChangePasswordScreen: {account : IAccount};
  ForgetPassword: {};

  CreateBlockForm: {};
  Apartment: {
    block_id: string;
  };
  ServiceForm: {
    service?: IService;
  };
  ServiceDetailForm: {
    apartmentId: string;
  };
  UpdateBlockForm: {
    block_id: string,
  };
  UpdateApartmentForm: {
    block_id: string,
    floor_id: string,
    apartment_id: string;
  };
  CreateApartmentForm: {
    block_id: string,
  };
  BlockForm: {
    block?: IBlock;
  };
  CreateInvoiceForm: { apartment_id: string };
  UpdateInvoiceForm: { invoice: IInvoice };
  InvoiceSettingForm: {};
  SetupServiceForm: { apartment_id: string }; 
  UpdateAccountForm: {
    account: IAccount;
  };
  ChangePasswordForm: {
    account: IAccount;
  };
  CreateContractForm: {
    apartment_id: string,
    onCreateContract:(contract: IContractRequest) => void,
  };
  ContractDetailsForm: {
    contract: any;
  };

  CreateRenterRecordForm: {
    apartment_id: string,
  };
  UpdateRentalRecordForm: {
    rentalRecord: any,
  };
  UpdateOwnerForm: {
    owner?: IOwner,
    household_id?: string,
  };
  UpdateRenterForm: {
    renter?: IRenter,
    record_id?: string,
  };


  
};