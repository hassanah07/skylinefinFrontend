import React from "react";

const SignatureFooter = ({ borrower }) => {
  return (
    <>
      <span className="text-center">
        <p className="text-center text-red-500 font-bold py-0 mt-1">
          ☐ I acknowledge and accept all the terms and conditions and declare
          that the information furnished above is complete and accurate to the
          best of my knowledge and belief.
        </p>
      </span>
      <div className="mt-6 grid grid-cols-2 gap-8 py-5">
        <div className="text-sm">
          <div className="text-gray-600">Borrower</div>
          <div className="mt-6">
            <div className="font-medium uppercase">
              {borrower || "|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|__|"}
            </div>
            <div className="text-gray-600 py-3">
              Signature: ______________________
            </div>
            <div className="text-gray-600 mt-1">
              Date: &nbsp;
              <b>
                <u>
                  {new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
                </u>
              </b>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-gray-600">For and on behalf of Lender</div>
          <div className="mt-6">
            <div className="font-medium">Authorized Signatory</div>
            <div className="text-gray-600 py-3">
              Signature: ______________________
            </div>
            <div className="text-gray-600 mt-1">
              Date: &nbsp;
              <b>
                <u>
                  {new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
                </u>
              </b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureFooter;
