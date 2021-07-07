import React, { useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import styles from "./Plans.module.css";

const Plans = (props) => {
  const { onBuyPlan, toggle, status } = props;
  const { t } = useTranslation("profile");

  const check = 
  <Image
    width={24}
    height={24}
    className="bi"
    src="/check-solid.svg"
  />;

  return (
    <>
    <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
      <h1 className="display-4 fw-normal">{t("formulary-plan.plans")}</h1>
      <p className="fs-5 text-muted">{t("formulary-plan.message")}</p>
    </div>

      <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
              <h4 className="my-0 fw-normal">
                {t("formulary-plan.basic-plan")}
              </h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                ${process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE}
              </h1>
              <ul className={`${styles.ul} list-unstyled mt-3 mb-4`}>
                <li>{`${t("formulary-plan.includes")} ${
                  process.env.NEXT_PUBLIC_BASIC_PLAN_AMOUNT_TOKENS
                } ${t("formulary-plan.tokens")}`}</li>
                <li className={styles.message}>
                  {t("formulary-plan.basic-message")}
                </li>
              </ul>
              <button
                onClick={() => onBuyPlan(process.env.NEXT_PUBLIC_BASIC_PLAN)}
                type="button"
                className="w-100 btn btn-lg btn-outline-primary"
              >
                {t("formulary-plan.buy-now")}
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
              <h4 className="my-0 fw-normal">
                {t("formulary-plan.medium-plan")}
              </h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                ${process.env.NEXT_PUBLIC_MEDIUM_PLAN_PRICE}
              </h1>
              <ul className={`${styles.ul} list-unstyled mt-3 mb-4`}>
                <li>{`${t("formulary-plan.includes")} ${
                  process.env.NEXT_PUBLIC_MEDIUM_PLAN_AMOUNT_TOKENS
                } ${t("formulary-plan.tokens")}`}</li>
                <li className={styles.message}>
                  {t("formulary-plan.medium-message")}
                </li>
              </ul>
              <button
                onClick={() => onBuyPlan(process.env.NEXT_PUBLIC_MEDIUM_PLAN)}
                type="button"
                className="w-100 btn btn-lg btn-primary"
              >
                {t("formulary-plan.buy-now")}
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border-primary">
            <div className="card-header py-3 text-white bg-primary border-primary">
              <h4 className="my-0 fw-normal">
                {t("formulary-plan.advance-plan")}
              </h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                ${process.env.NEXT_PUBLIC_ADVANCE_PLAN_PRICE}
              </h1>
              <ul className={`${styles.ul} list-unstyled mt-3 mb-4`}>
                <li>{`${t("formulary-plan.includes")} ${
                  process.env.NEXT_PUBLIC_ADVANCE_PLAN_AMOUNT_TOKENS
                } ${t("formulary-plan.tokens")}`}</li>
                <li className={styles.message}>
                  {t("formulary-plan.advance-message")}
                </li>
              </ul>
              <button
                onClick={() => onBuyPlan(process.env.NEXT_PUBLIC_ADVANCE_PLAN)}
                type="button"
                className="w-100 btn btn-lg btn-primary"
              >
                {t("formulary-plan.buy-now")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {status == "approved"  && (
        <div className="alert alert-success" role="alert">
          {`${t("formulary-plan.successful-message")}`}
        </div>
      )}

      <h2 className="display-6 text-center mb-4">{t("formulary-plan.compare-plans")}</h2>

      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th className={styles.firstTh}></th>
              <th className={styles.th}>{t("formulary-plan.basic-plan")}</th>
              <th className={styles.th}>{t("formulary-plan.medium-plan")}</th>
              <th className={styles.th}>{t("formulary-plan.advance-plan")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="text-start">
                {t("formulary-plan.increased-visibility")}
              </th>
              <td>{check}</td>
              <td>{check}</td>
              <td>{check}</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">
                {t("formulary-plan.price")}
              </th>
              <td>{process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE}$</td>
              <td>{process.env.NEXT_PUBLIC_MEDIUM_PLAN_PRICE}$</td>
              <td>{process.env.NEXT_PUBLIC_ADVANCE_PLAN_PRICE}$</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">
                {t("formulary-plan.amount-tokens")}
              </th>
              <td>{process.env.NEXT_PUBLIC_BASIC_PLAN_AMOUNT_TOKENS}</td>
              <td>{process.env.NEXT_PUBLIC_MEDIUM_PLAN_AMOUNT_TOKENS}</td>
              <td>{process.env.NEXT_PUBLIC_ADVANCE_PLAN_AMOUNT_TOKENS}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Plans;
