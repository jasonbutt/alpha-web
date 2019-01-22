import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AutosizeTextarea from 'react-autosize-textarea';

import MediaSelector from '../../CreatePost/MediaSelector';
import PostBody from '../../../PostBody';
import styles from './styles.scss';
import { getMarkdownText } from '../reducer';
import { setMarkdownText, uploadImage } from '../actions';

class MarkdownEditor extends React.Component {
  static propTypes = {
    bodyMarkdown: PropTypes.string,
    onChange: PropTypes.func,
    onImageUpload: PropTypes.func,
  };

  static defaultProps = {
    bodyMarkdown: '',
    onChange: '',
    onImageUpload: () => { },
  };

  constructor(props) {
    super(props);

    this.textAreaRef = null;
    this.state = {
      isImageUploading: false,
    };

    this.onImageSelected = this.onImageSelected.bind(this);
  }

  onImageSelected(file) {
    if (!this.textAreaRef) {
      return;
    }
    const { onImageUpload, onChange, bodyMarkdown } = this.props;
    this.setState({ ...this.state, isImageUploading: true });
    onImageUpload(file)
      .then(({ url, error }) => {
        if (error) {
          return;
        }
        const startPos = this.textAreaRef.selectionStart;
        const endPos = this.textAreaRef.selectionEnd;
        const imageText = `![](${url})\n`;
        onChange(`${bodyMarkdown.substring(0, startPos)}${imageText}${bodyMarkdown.substring(endPos, bodyMarkdown.length)}`);
        this.setState({ ...this.state, isImageUploading: false });
      });
  }

  render() {
    const { bodyMarkdown, onChange } = this.props;
    const { isImageUploading } = this.state;
    return (
      <div className={`uk-margin-top ${styles.editorWrite}`}>
        <AutosizeTextarea
          value={bodyMarkdown}
          onChange={event => onChange(event.target.value)}
          className="uk-textarea uk-margin-bottom"
          rows={5}
          innerRef={(ref) => { this.textAreaRef = ref; }}
        />
        <div className={styles.imageUploadContainer}>
          <MediaSelector changeMedia={this.onImageSelected} />
          { isImageUploading && <span className={styles.uploadingText}>Uploading image...</span>}
        </div>
        <div className={styles.previewContainer}>
          <span>Preview</span>
          <PostBody className={styles.previewBody} body={bodyMarkdown} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bodyMarkdown: getMarkdownText(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onChange: setMarkdownText,
  onImageUpload: uploadImage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownEditor);