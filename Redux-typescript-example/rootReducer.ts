import { AnyAction, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth/authReducer';
import { SIGN_OUT_SUCCESS } from './auth/authActions';
import history from './history';
import resourceReducer, {
  createResoucesReducer,
} from './resource/resourceReducer';
import UserRecord from '../domains/users/UserRecord';
import VehicleRecord from '../domains/vehicles/vehicles/VehicleRecord';
import EquipmentRecord from '../domains/equipments/equipments/EquipmentRecord';
import ServiceTasksRecord from '../domains/serviceTasks/ServiceTasksRecord';
import TrackerLogsRecord from '../domains/trackers/trackers/logs/TrackerLogsRecord';
import TrackerAllRecord from '../domains/trackers/trackersAll/TrackerAllRecord';
import usersReducer from './users/usersReducer';
import vehiclesReducer from './vehicles/vehiclesReducer';
import equipmentsReducer from './equipments/equipmentsReducer';
import wialonReducer from './wialon/wialonReducer';
import trackReducer from './track/trackReducer';
import monitoringReducer from './monitoring/monitoringReducer';
import permissionsReducer from './permissions/permissionsReducer';
import WarehouseRecord from '../domains/warehouses/WarehouseRecord';
import BrandRecord from '../domains/parts/brands/BrandRecord';
import brandsReducer from './parts/brands/brandsReducer';
import CategoryRecord from '../domains/parts/categories/CategoryRecord';
import RoleRecord from '../domains/settings/Users/Roles/RoleRecord';
import categoriesReducer from './parts/categories/categoriesReducer';
import PartRecord from '../domains/parts/parts/PartRecord';
import CompanyRecord from '../domains/companies/CompanyRecord';
import partsReducer from './parts/parts/partsReducer';
import TrafficFineRecord from '../domains/trafficFines/TrafficFineRecord';

const appReducer = combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  wialon: wialonReducer,
  tracks: trackReducer,
  monitoring: monitoringReducer,
  permission: permissionsReducer,
  resources: combineReducers({
    users: createResoucesReducer<typeof UserRecord>(
      resourceReducer,
      'users',
      UserRecord,
      usersReducer
    ),
    archiveUsers: createResoucesReducer<typeof UserRecord>(
      resourceReducer,
      'archiveUsers',
      UserRecord
    ),
    vehicles: createResoucesReducer<typeof VehicleRecord>(
      resourceReducer,
      'vehicles',
      VehicleRecord,
      vehiclesReducer
    ),
    archiveVehicles: createResoucesReducer<typeof VehicleRecord>(
      resourceReducer,
      'archiveVehicles',
      VehicleRecord
    ),
    equipments: createResoucesReducer<typeof EquipmentRecord>(
      resourceReducer,
      'equipments',
      EquipmentRecord,
      equipmentsReducer
    ),
    archiveEquipments: createResoucesReducer<typeof EquipmentRecord>(
      resourceReducer,
      'archiveEquipments',
      EquipmentRecord
    ),
    trackerLogs: createResoucesReducer<typeof TrackerLogsRecord>(
      resourceReducer,
      'trackerLogs',
      TrackerLogsRecord
    ),
    trackers: createResoucesReducer<typeof TrackerAllRecord>(
      resourceReducer,
      'trackers',
      TrackerAllRecord
    ),
    serviceTasks: createResoucesReducer<typeof ServiceTasksRecord>(
      resourceReducer,
      'serviceTasks',
      ServiceTasksRecord
    ),
    trafficFines: createResoucesReducer<typeof TrafficFineRecord>(
      resourceReducer,
      'trafficFines',
      TrafficFineRecord
    ),
    companies: createResoucesReducer<typeof CompanyRecord>(
      resourceReducer,
      'companies',
      CompanyRecord
    ),
    warehouses: createResoucesReducer<typeof WarehouseRecord>(
      resourceReducer,
      'warehouses',
      WarehouseRecord
    ),
    articles: createResoucesReducer<typeof PartRecord>(
      resourceReducer,
      'articles',
      PartRecord,
      partsReducer
    ),
    articleCategories: createResoucesReducer<typeof CategoryRecord>(
      resourceReducer,
      'articleCategories',
      CategoryRecord,
      categoriesReducer
    ),
    articleBrands: createResoucesReducer<typeof BrandRecord>(
      resourceReducer,
      'articleBrands',
      BrandRecord,
      brandsReducer
    ),
    roles: createResoucesReducer<typeof RoleRecord>(
      resourceReducer,
      'roles',
      RoleRecord
    ),
  }),
});

/**
 * Clean redux store on sign out
 * @param state
 * @param action
 */
const rootReducer = (
  state: any | undefined,
  action: AnyAction
): ReturnType<typeof appReducer> => {
  if (action.type === SIGN_OUT_SUCCESS) {
    // @ts-ignore
    return appReducer({ router: state.router }, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
