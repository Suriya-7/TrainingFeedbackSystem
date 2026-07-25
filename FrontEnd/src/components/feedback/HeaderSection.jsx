import dietechLogo from "../../assets/dietech-logo.png";

function HeaderSection() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

      {/* Company Header */}

      {/* ---- Mobile layout (below md) ---- */}
      <div className="flex md:hidden items-center gap-3 p-3 border-b border-gray-200">
        <img
          src={dietechLogo}
          alt="Dietech Logo"
          className="max-h-14 w-auto object-contain shrink-0"
        />

        <div className="flex flex-col">
          <h1 className="text-base font-bold text-gray-800 leading-tight">
            DIETECH INDIA P LTD
          </h1>

          <div className="mt-1 text-xs text-gray-700 leading-relaxed">
            <p>
              <span className="font-semibold">DOC No :</span> DT/HR/TFB/01 REV
            </p>
            <p>
              <span className="font-semibold">No :</span> DT:00/11.03.2015
            </p>
            <p>
              <span className="font-semibold">DCR No :</span> 954
            </p>
          </div>
        </div>
      </div>

      {/* ---- Desktop layout (md and up) ---- */}
      <div className="hidden md:grid md:grid-cols-12">

        {/* Logo Section */}
        <div className="md:col-span-3 flex items-center justify-center p-3 border-b md:border-b-0 md:border-r border-gray-200">
          <img
            src={dietechLogo}
            alt="Dietech Logo"
            className="max-h-14 md:max-h-16 object-contain"
          />
        </div>

        {/* Company Name */}
        <div className="md:col-span-6 flex items-center justify-center p-3 border-b md:border-b-0 md:border-r border-gray-200">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 text-center leading-tight">
            DIETECH INDIA P LTD
          </h1>
        </div>

        {/* Document Details */}
        <div className="md:col-span-3 flex flex-col justify-center p-3 text-xs text-gray-700 leading-relaxed">
          <p>
            <span className="font-semibold">DOC No :</span> DT/HR/TFB/01 REV
          </p>
          <p>
            <span className="font-semibold">No :</span> DT:00/11.03.2015
          </p>
          <p>
            <span className="font-semibold">DCR No :</span> 954
          </p>
        </div>

      </div>

      {/* Form Title */}
      <div className="bg-gray-50 border-t border-gray-200 text-center px-4 py-3">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 underline">
          TRAINING - FEEDBACK FORM
        </h2>
      </div>

    </div>
  );
}

export default HeaderSection;