import { useCallback, useMemo, useState } from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { TooltipProps } from 'antd/es/tooltip';
import { useUpdateEffect } from 'ahooks';
import FocusWrapper from '@/components/FocusWrapper';

const Tooltip = (props: TooltipProps) => {
  const {
    onOpenChange: propsOnVisibleChange,
    title: propsTitle,
    open: propsVisible,
    ...nextProps
  } = props;

  const [visible, setVisible] = useState<boolean>(!!propsVisible);

  const onVisibleChange = useCallback(
    (visible) => {
      setVisible(visible);
      propsOnVisibleChange?.(visible);
    },
    [propsOnVisibleChange],
  );

  const title = useMemo(() => {
    return <FocusWrapper force={visible}>{propsTitle}</FocusWrapper>;
  }, [propsTitle, visible]);

  useUpdateEffect(() => {
    setVisible(!!propsVisible);
  }, [propsVisible]);

  return (
    <AntTooltip
      {...nextProps}
      title={title}
      onOpenChange={onVisibleChange}
      open={visible}
    />
  );
};

export default Tooltip;
