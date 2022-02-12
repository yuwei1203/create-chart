import { useMemo } from 'react';
import { connect } from 'dva';
import CodeEditor, { EditorProps } from '@/components/CodeEditor';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { mapStateToProps, mapDispatchToProps } from './connect';

const CodeViewer = (
  props: {
    value: ComponentData.TComponentApiDataConfig;
    filter: ComponentData.TFilterConfig[];
    params: ComponentData.TParams[];
  } & Partial<Omit<EditorProps, 'value'>>,
) => {
  const { filter, value, params, ...nextProps } = props;

  const responseData = useMemo(() => {
    return FilterDataUtil.getPipeFilterValue(value, filter, params);
  }, [value, filter, params]);

  return (
    <CodeEditor
      disabled
      language="json"
      width={'312'}
      height={'240'}
      bordered
      autoFormat
      {...nextProps}
      value={responseData}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeViewer);
