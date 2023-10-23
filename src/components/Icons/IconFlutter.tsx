import { Icon } from '@aws-amplify/ui-react';

export const IconFlutter = ({ ...rest }) => {
  return (
    <Icon
      {...rest}
      viewBox={{
        minX: 0,
        minY: 0,
        width: 24,
        height: 24
      }}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.1101 24L7.63571 17.5482L11.2145 13.8963L21.3088 24H14.1101Z"
        fill="#02539A"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.55557 17.5531L13.974 11.1159H21.1893L11.2044 21.1298L7.55557 17.5531Z"
        fill="#45D1FD"
        fill-opacity="0.85"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 11.9385L5.64384 15.5907L21.1891 0H13.9363L2 11.9385Z"
        fill="#45D1FD"
      />
    </Icon>
  );
};