import type { Platform } from '@/constants/platforms';
import { Flex, Text, View } from '@aws-amplify/ui-react';
import { FRAMEWORKS } from '@/constants/frameworks';
import { PLATFORM_VERSIONS, PLATFORMS } from '@/constants/platforms';
import { VersionSwitcher } from '../VersionSwitcher';
import { Popover } from '../Popover';

type PlatformNavigatorProps = {
  currentPlatform: Platform;
  isGen1: boolean;
};

export function PlatformNavigator({
  currentPlatform,
  isGen1
}: PlatformNavigatorProps) {
  const platformTitle = PLATFORMS[currentPlatform];

  const platformItem = FRAMEWORKS.filter((platform) => {
    return platform.title === platformTitle;
  })[0];

  return (
    <>
      <View className={`platform-navigator`}>
        <Text
          fontWeight="bold"
          id="platformNavigatorLabel"
          paddingBottom="small"
        >
          Choose your framework/language
        </Text>
        <Flex alignItems="center">
          <Popover flex="1 0 auto">
            <Popover.Trigger
              className={`platform-navigator__button`}
              isFullWidth={true}
              aria-describedby="platformNavigatorLabel"
            >
              {platformItem.icon}
              {platformTitle}
            </Popover.Trigger>
            <Popover.List
              ariaLabel="Supported FRAMEWORKS and languages"
              anchor="left"
              fullWidth={true}
            >
              {FRAMEWORKS.map((platform, index) => {
                const title = platform.title;
                const current = title === platformTitle;
                return (
                  <Popover.ListItem
                    current={current}
                    key={`platform-${index}`}
                    href={isGen1 ? `/gen1${platform.href}` : platform.href}
                  >
                    {platform.icon}
                    {platform.title}
                  </Popover.ListItem>
                );
              })}
            </Popover.List>
          </Popover>

          {isGen1 && PLATFORM_VERSIONS[currentPlatform] && (
            <VersionSwitcher platform={currentPlatform} />
          )}
        </Flex>
      </View>
    </>
  );
}
