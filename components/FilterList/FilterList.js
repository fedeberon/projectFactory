import React, {useEffect} from "react";
import filterListStyles from './FilterList.module.css';
import { useTranslation } from "react-i18next";

const FilterList = ({ filters, appliedFilters, setAppliedFilters }) => {
    const { t, lang } = useTranslation("common");

    const list = filters.map((filter) =>
        <li key={filter.tag} onClick={() => onClickFilter(filter)}>
            <span className={filterListStyles.clickeable}>{filter.tag}</span>
        </li>
    );

    const onClickFilter = filter => {
        if (appliedFilters.includes(filter)) {
            removeFilter(filter);
        } else {
            addFilter(filter);
        }
    };

    const addFilter = filter => {
        const newAppliedFilters = Array.from(appliedFilters); 
        newAppliedFilters.push(filter);
        setAppliedFilters(newAppliedFilters);
    };

    const removeFilter = filter => {
        const newAppliedFilters = Array.from(appliedFilters); 
        const index = newAppliedFilters.indexOf(filter);
        if (index > -1) {
          newAppliedFilters.splice(index, 1);
          setAppliedFilters(newAppliedFilters);
        }
    };

    useEffect(() => {
        /*
        if (appliedFilters.length > 0) {
          setShowProjects(false);
        } else {
          setShowProjects(true);
        }
        */
    }, [appliedFilters]);

    return (<>
        <div className={filterListStyles.container}>
            <div className={filterListStyles.header}>{t("Filters")}</div>
            <ul className={filterListStyles.ul}>
                {list}
            </ul>
        </div>

    </>);
};

export default FilterList;