import dietechLogo from "../../assets/dietech-logo.png";

function HeaderSection() {
  return (
    <div className="border border-black">

      {/* Top Header */}
      <div className="grid grid-cols-12 border-b border-black">

       {/* Logo */}
<div className="col-span-3 flex items-center justify-center border-r border-black h-24 p-2">
  <img
    src={dietechLogo}
    alt="Dietech Logo"
    className="max-h-20 object-contain"
  />
</div>

        {/* Company Name */}
        <div className="col-span-6 flex items-center justify-center border-r border-black">
          <h1 className="text-3xl font-bold">
            DIETECH INDIA P LTD
          </h1>
        </div>

        {/* Document Details */}
        <div className="col-span-3 text-sm p-2">
          <p>DOC No : DT/HR/TFB/01 REV</p>
          <p>No: DT:00/11.03.2015</p>
          <p>DCR No : 954</p>
        </div>

      </div>

      {/* Form Title */}
      <div className="text-center py-3">
        <h2 className="text-2xl font-bold underline">
          TRAINING - FEEDBACK FORM
        </h2>
      </div>

    </div>
  );
}

export default HeaderSection;