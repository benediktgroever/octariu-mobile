import { RootState } from "../..";
import { getSettings } from "../actions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { updateSettings, deleteUserAccount } from '../actions';



const useListSettingsQuery = () => {

    const { isLoading, settings } = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        getSettings();
    }, [getSettings])


    return {
        isLoading,
        settings,
        updateSettings,
        deleteUserAccount,
    }
}

export { useListSettingsQuery }
