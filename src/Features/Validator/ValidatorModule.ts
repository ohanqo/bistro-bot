import { TYPES } from "@/App/AppTypes";
import { ContainerModule, interfaces } from "inversify";
import TargetsAreNotAdminValidator from "./TargetsAreNotAdminValidator";
import TargetsAreInJailValidator from "./TargetsAreInJailValidator";
import SenderHasEditRolePermissionValidator from "./SenderHasEditRolePermissionValidator";

const validatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.TARGETS_NOT_ADMIN_VALIDATOR).to(TargetsAreNotAdminValidator);
  bind(TYPES.TARGETS_IN_JAIL_VALIDATOR).to(TargetsAreInJailValidator);
  bind(TYPES.SENDER_HAS_EDIT_ROLE_VALIDATOR).to(SenderHasEditRolePermissionValidator);
});

export { validatorModule };
