import { Accessibility, buttonBehavior, ButtonBehaviorProps } from '@fluentui/accessibility';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as _ from 'lodash';

import {
  childrenExist,
  createShorthandFactory,
  UIComponentProps,
  ChildrenComponentProps,
  commonPropTypes,
  rtlTextContainer,
  ContentComponentProps,
  SizeValue,
} from '../../utils';

import {
  ComponentEventHandler,
  WithAsProp,
  withSafeTypeForAs,
  FluentComponentStaticProps,
  ProviderContextPrepared,
} from '../../types';
import { getElementType, useAccessibility, useStyles, useTelemetry, useUnhandledProps } from '@fluentui/react-bindings';
// @ts-ignore
import { ThemeContext } from 'react-fela';

export interface SplitButtonToggleProps extends UIComponentProps, ContentComponentProps, ChildrenComponentProps {
  /** Accessibility behavior if overridden by the user. */
  accessibility?: Accessibility<ButtonBehaviorProps>;

  /** A split button toggle can show that it cannot be interacted with. */
  disabled?: boolean;

  /**
   * Called after a user clicks the button.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onClick?: ComponentEventHandler<SplitButtonToggleProps>;

  /** A split button toggle can emphasize that it represents the primary action. */
  primary?: boolean;

  /** A split button toggle can emphasize that it represents an alternative action. */
  secondary?: boolean;

  /** A split button toggle can be sized */
  size?: SizeValue;
}

export type SplitButtonToggleStylesProps = Pick<SplitButtonToggleProps, 'primary' | 'disabled' | 'size'>;

const SplitButtonToggle: React.FC<WithAsProp<SplitButtonToggleProps>> &
  FluentComponentStaticProps<SplitButtonToggleProps> = props => {
  const context: ProviderContextPrepared = React.useContext(ThemeContext);
  const { setStart, setEnd } = useTelemetry(SplitButtonToggle.displayName, context.telemetry);
  setStart();

  const { accessibility, as, children, content, disabled, primary, className, size, styles, variables, design } = props;

  const hasChildren = childrenExist(children);

  const getA11Props = useAccessibility(accessibility, {
    debugName: SplitButtonToggle.displayName,
    mapPropsToBehavior: () => ({
      as,
      disabled,
    }),
    actionHandlers: {
      performClick: event => {
        event.preventDefault();
        handleClick(event);
      },
    },
    rtl: context.rtl,
  });
  const { classes } = useStyles<SplitButtonToggleStylesProps>(SplitButtonToggle.displayName, {
    className: SplitButtonToggle.className,
    mapPropsToStyles: () => ({
      primary,
      disabled,
      size,
    }),
    mapPropsToInlineStyles: () => ({
      className,
      design,
      styles,
      variables,
    }),
    rtl: context.rtl,
  });

  const unhandledProps = useUnhandledProps(SplitButtonToggle.handledProps, props);
  const ElementType = getElementType(props);

  const handleClick = (e: React.SyntheticEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    _.invoke(props, 'onClick', e, props);
  };

  const result = (
    <ElementType
      {...rtlTextContainer.getAttributes({ forElements: [children] })}
      {...getA11Props('root', {
        onClick: handleClick,
        disabled,
        className: classes.root,
        ...unhandledProps,
      })}
    >
      {hasChildren ? children : content}
    </ElementType>
  );

  setEnd();

  return result;
};

SplitButtonToggle.defaultProps = {
  as: 'button',
  accessibility: buttonBehavior,
};

SplitButtonToggle.displayName = 'SplitButtonToggle';
SplitButtonToggle.className = 'ui-splitbutton__toggle';

SplitButtonToggle.propTypes = {
  ...commonPropTypes.createCommon({}),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  primary: customPropTypes.every([customPropTypes.disallow(['secondary']), PropTypes.bool]),
  secondary: customPropTypes.every([customPropTypes.disallow(['primary']), PropTypes.bool]),
  size: customPropTypes.size,
};

SplitButtonToggle.handledProps = Object.keys(SplitButtonToggle.propTypes) as any;

SplitButtonToggle.create = createShorthandFactory({ Component: SplitButtonToggle, mappedProp: 'content' });

/**
 * A SplitToggleButton allows users to customize the toggle button inside the SplitButton.
 *
 * @accessibility
 * Implements [ARIA Button](https://www.w3.org/TR/wai-aria-practices-1.1/#button) design pattern.
 */
export default withSafeTypeForAs<typeof SplitButtonToggle, SplitButtonToggleProps, 'button'>(SplitButtonToggle);
