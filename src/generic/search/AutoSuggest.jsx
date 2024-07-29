import { Form } from '@openedx/paragon';
import { useEffect, useState } from 'react';
import getSearchEngineAuthToken from '@src/generic/search/api';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';

const CoursewareAutoSuggest = ({ courseId }) => {
  const [state, setState] = useState({ token: undefined, results: [], loading: false });
  useEffect(async () => {
    const token = await getSearchEngineAuthToken();
    setState({ ...state, token });
  }, []);
  return (
    <Form.Autosuggest
      placeholder="Seach course module ..."
      screenReaderText="Loading..."
      isLoading={state.loading}
      onChange={(val) => {
        const { userProvidedText } = val;
        if (state.token) {
          setState({ ...state, loading: true });
          const searchEngine = new SearchEngine(state.token.search_engine, state.token, 'courseware_course_structure'); // eslint-disable-line
          searchEngine.search(userProvidedText, { course: courseId }, (resp) => {
            setState({ ...state, results: resp.results, loading: false });
          }, () => {
          });
        }
      }}
    >
      {state.results.map(h => (
        <Form.AutosuggestOption
          key={h.item_id}
          onClick={() => {
            window.location.replace(`${getConfig().LMS_BASE_URL}/courses/${courseId}/jump_to/${h.usage_key}`);
          }}
        >
          {h.content.display_name}
        </Form.AutosuggestOption>
      ))}
    </Form.Autosuggest>
  );
};

CoursewareAutoSuggest.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CoursewareAutoSuggest;
