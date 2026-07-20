import dietechLogo from "../../assets/dietech-logo.png";

function HeaderSection() {

  return (

    <div className="border border-black">

      <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-black">

        <div className="sm:col-span-3 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-black h-16 sm:h-20 p-1">

          <img
            src={dietechLogo}
            alt="Dietech Logo"
            className="max-h-14 sm:max-h-16 object-contain"
          />

        </div>

        <div className="sm:col-span-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-black p-2">

          <h1 className="text-xl sm:text-3xl font-bold text-center leading-tight">

            DIETECH INDIA P LTD

          </h1>

        </div>

        <div className="sm:col-span-3 text-xs sm:text-sm p-1 leading-tight">

          <p>
            DOC No : DT/HR/TFB/01 REV
          </p>

          <p>
            No: DT:00/11.03.2015
          </p>

          <p>
            DCR No : 954
          </p>

        </div>

      </div>

      <div className="text-center py-2">

        <h2 className="text-lg sm:text-2xl font-bold underline leading-tight">

          TRAINING - FEEDBACK FORM

        </h2>

      </div>

    </div>

  );

}

export default HeaderSection;