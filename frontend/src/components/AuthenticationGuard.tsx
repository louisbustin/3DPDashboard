import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType, PropsWithoutRef } from "react";
import LoadingDialog from "./LoadingDialog";

export const AuthenticationGuard = (
  props: PropsWithoutRef<{ component: ComponentType<object> }>
) => {
  const C = withAuthenticationRequired(props.component, {
    onRedirecting: () => <LoadingDialog open={true}></LoadingDialog>,
  });

  return <C />;
};
