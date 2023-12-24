// validationHelper.ts
export const validateFields = (fields: any[]): boolean => {
    if (fields.some((field) => !field)) {
      alert("Please fill in all required fields.");
      return true;
    }
    return false;
  };
  