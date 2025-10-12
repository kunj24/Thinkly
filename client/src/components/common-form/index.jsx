import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/loading-spinner";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  loading = false,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button 
        disabled={isButtonDisabled || loading} 
        type="submit" 
        className="mt-5 w-full flex items-center justify-center space-x-2"
      >
        {loading && <ButtonLoader />}
        <span>{loading ? "Please wait..." : (buttonText || "Submit")}</span>
      </Button>
    </form>
  );
}

export default CommonForm;
