import React, {useEffect} from "react";
import {useAppSelector} from "../../../hooks/redux";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import {selectIsAuth, selectIsAuthLoading} from "../model/selectors";
import ProfileTabs from "./ProfileTabs";
import ProfileHeader from "./ProfileHeader";
import Preloader from "../../../components/common/Preloader";
import PageTemplate from "../../../components/templates/PageTemplate";

const Profile = () => {
    const navigate = useNavigate();
    const isAuth = useAppSelector(selectIsAuth);
    const isAuthLoading = useAppSelector(selectIsAuthLoading);
    useEffect(() => {
        if (!isAuth) navigate(routes.login);
    }, [isAuth]);
    if (isAuthLoading || !isAuth) return <Preloader/>;
    return (
        <PageTemplate authOnly>
            <ProfileHeader/>
            <ProfileTabs/>
        </PageTemplate>
    );
};

export default Profile;
