import { ConnectState } from '@/models/connect';

export const mapStateToProps = (state: ConnectState) => {
  return {
    filter: state.global.screenData.config.attr.filter,
    params: state.global.screenData.config.attr.params,
  };
};

export const mapDispatchToProps = (dispatch: any) => ({});
