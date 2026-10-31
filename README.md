# @lp-labs/react-transfer-list

Searchable dual-list transfer controls with native checkboxes and bulk movement. React 18+ peer only; ESM, CommonJS and TypeScript included.

## Installation

```sh
npm install @lp-labs/react-transfer-list
```

## Quick Start

```jsx
import { TransferList } from '@lp-labs/react-transfer-list';
export default function Example() {
  return (
    <TransferList
      options={[
        { id: 'read', label: 'Read' },
        { id: 'write', label: 'Write' },
        { id: 'admin', label: 'Admin', disabled: true },
      ]}
      defaultValue={['read']}
      onChange={(ids) => console.log(ids)}
    />
  );
}
```

## API

Options contain unique id,label and optional disabled. Props: options, value/defaultValue (target IDs), onChange, sourceLabel='Available', targetLabel='Selected', maxVisible=200, disabled, renderOption(option), className. Search and check state are independent per side. Arrow buttons move checked or all matching enabled options; disabled existing target items stay in place. Select-all checks matching entries, not only the rendered prefix. Target output order follows original options. Controlled value requires onChange. Native form controls provide keyboard interaction; this is not a custom listbox focus model.

## Benefits

| Area                | Details                                       |
| ------------------- | --------------------------------------------- |
| Bulk movement       | Move checked or all matching enabled entries. |
| Independent filters | Search source and destination separately.     |
| Controlled state    | Integrate target IDs with application state.  |

## Customization

| Area    | Details                                                  |
| ------- | -------------------------------------------------------- |
| Options | Provide unique IDs, labels, and disabled flags.          |
| Limits  | Set visible match prefix and disabled overall state.     |
| Labels  | Customize source/destination names and option rendering. |

## Security And Limits

At most 10,000 options; maxVisible: 1–1,000; search: 256 characters per side. Lists render a bounded prefix and ask users to refine search for more. Bulk actions affect all matching options. No server permissions, persistence, cross-list drag/drop or remote pagination. A disabled option is a UI affordance, not an authorization boundary. Custom option content must not inject untrusted HTML or nested conflicting labels/controls.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
