import useCurrentUser from './useCurrentUser';

const useFeature = (featureKey: 'featureTrafficFines'): boolean => {
  const user = useCurrentUser();

  return user.relations.organization[featureKey];
};

export default useFeature;
