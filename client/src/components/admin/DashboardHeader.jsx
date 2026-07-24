import { RefreshCw, Database } from "lucide-react";

function DashboardHeader({
  totalFeedbacks = 0,
  onRefresh,
  loading = false,
}) {

  return (
    <div className="mb-6">

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-5
          sm:p-6
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
        "
      >


        {/* Left Content */}

        <div>

          <div
            className="
              flex
              items-center
              gap-2
              mb-2
            "
          >

            <div
              className="
                w-2
                h-8
                rounded-full
                bg-gray-900
              "
            />

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
              "
            >
              Admin Dashboard
            </h1>

          </div>


          <p
            className="
              text-sm
              sm:text-base
              text-gray-500
              max-w-xl
            "
          >
            Manage and monitor all submitted training feedback records from employees.
          </p>


        </div>




        {/* Right Actions */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-stretch
            sm:items-center
            gap-3
          "
        >


          {/* Total Feedback Card */}

          <div
            className="
              flex
              items-center
              gap-3
              px-5
              py-3
              rounded-2xl
              bg-gray-50
              border
              border-gray-200
              min-w-[180px]
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-gray-900
                text-white
                flex
                items-center
                justify-center
                shadow-sm
              "
            >
              <Database size={20}/>
            </div>


            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-500
                  font-medium
                "
              >
                Total Feedback
              </p>


              <h2
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                  leading-tight
                "
              >
                {totalFeedbacks}
              </h2>


            </div>


          </div>




          {/* Refresh Button */}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-gray-900
              text-white
              text-sm
              font-medium
              shadow-sm
              hover:bg-gray-800
              hover:shadow-md
              transition-all
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />


            <span>
              {loading ? "Refreshing..." : "Refresh"}
            </span>


          </button>


        </div>


      </div>

    </div>
  );
}

export default DashboardHeader;