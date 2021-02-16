import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Button } from 'antd';

interface Props {
  to: string;
  history: any;
  location: any;
  match: any;
  staticContext: any;
  onClick?: any;
  children: React.ReactNode;

  [propName: string]: any;
}

const LinkButton: React.FC<Props> = ({
                                       history,
                                       location,
                                       match,
                                       staticContext,
                                       to,
                                       onClick,
                                       ...props
                                     }) => {

  return (
    <Button
      type={'primary'}
      {...props}
      onClick={(event) => {
        onClick && onClick(event);
        history.push(to);
      }}
    />
  );
};

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default withRouter(LinkButton);
