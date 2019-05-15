import React, { Component } from "react";
import { connect } from "react-redux";
import { uploadPhoto } from "../store";

class UploadPhoto extends Component {
  state = {
    valid: false,
    fileName: "",
    file: null,
    delete: false
  };
  onChange = ({
    target: {
      validity,
      files: [file]
    }
  }) => {
    this.setState({
      valid: validity.valid,
      fileName: file ? file.name : null,
      file,
      delete: false
    });
    this.props.setPreviewImage(file);
  };
  handleSubmit = async e => {
    const image = this.state.file;
    e.preventDefault();
    if (image && this.state.valid) {
      //   const { data } = await uploadImage({
      //     variables: { image, type: "profile" }
      //   });
      //   if (data && data.uploadImage) {
      //     const photo_path = data.uploadImage;
      //     // await client.mutate({
      //     //   mutation: UPDATE_PROFILE,
      //     //   variables: { input: { photo_path } },
      //     //   update
      //     // });
      //     this.props.cancelEdit();
      //   }
    } else if (this.state.delete) {
      const photo_path = null;
      //   await client.mutate({
      //     mutation: UPDATE_PROFILE,
      //     variables: { input: { photo_path } },
      //     update
      //   });
      this.props.cancelEdit(this.props.original);
    } else {
      this.props.cancelEdit(this.props.original);
    }
  };
  reset = () => {
    this.setState({
      valid: false,
      fileName: "",
      file: null,
      delete: true
    });
    this.props.setPreviewImage(null);
  };
  getText = () => {
    if (this.state.delete) {
      return "Delete your image?";
    }
    if (!this.state.fileName) {
      return "Choose an image";
    }
    if (!this.state.valid && this.state.fileName) {
      return "Invalid Image";
    }
    if (this.state.valid && this.state.fileName) {
      return "Do you like it?";
    }
    return null;
  };
  render() {
    return (
      <form>
        <input
          className="file-input"
          type="file"
          name="image"
          accept=".jpeg,.jpg,.png"
          onChange={this.onChange}
        />
        {this.getText || <button type="submit">Submit</button>}
      </form>
    );
  }
}

export default connect(
  null,
  { uploadPhoto }
)(UploadPhoto);
