interface GenderCheckboxProps {
  handleCheckboxChange: (gender: string) => void;
  selectedGender: string;
}

const GenderCheckbox = ({
  handleCheckboxChange,
  selectedGender,
}: GenderCheckboxProps) => {
  return (
    <div className="flex mt-2">
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer text-gray-300 ${
            selectedGender === "male" ? "selected" : ""
          } `}
        >
          <span>Male</span>
          <input
            type="checkbox"
            className="checkbox border-slate-500  w-5 h-5"
            checked={selectedGender === "male"}
            onChange={() => handleCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer text-gray-300 ${
            selectedGender === "female" ? "selected" : ""
          } `}
        >
          <span>Female</span>
          <input
            type="checkbox"
            className="checkbox border-slate-500 w-5 h-5"
            checked={selectedGender === "female"}
            onChange={() => handleCheckboxChange("female")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer text-gray-300 ${
            selectedGender === "prefer not to say" ? "selected" : ""
          } `}
        >
          <span>Prefer Not To Say</span>
          <input
            type="checkbox"
            className="checkbox border-slate-500 w-5 h-5"
            checked={selectedGender === "prefer not to say"}
            onChange={() => handleCheckboxChange("prefer not to say")}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
