import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType, PropsWithoutRef } from "react";

export const AuthenticationGuard = (
  props: PropsWithoutRef<{ component: ComponentType<object> }>
) => {
  const C = withAuthenticationRequired(props.component, {
    onRedirecting: () => <div className="page-layout">Loading...</div>,
  });

  return <C />;
};
