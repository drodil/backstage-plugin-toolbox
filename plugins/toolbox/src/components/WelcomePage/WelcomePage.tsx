import { useState } from 'react';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { RiSearchLine } from '@remixicon/react';
import { Alert, Text } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from './WelcomePage.module.css';

export type WelcomePageProps = {
  tools: Tool[];
};

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const { t } = useToolboxTranslation();
  const [search, setSearch] = useState('');

  const filteredTools = tools.filter(tool => {
    if (!search) return true;
    const toolName = t(`tool.${tool.id}.name`, {
      defaultValue: tool.displayName ?? tool.name,
    });
    const description = t(`tool.${tool.id}.description`, {
      defaultValue: tool.description,
    });
    return (
      toolName.toLowerCase().includes(search.toLowerCase()) ||
      tool.id.toLowerCase().includes(search.toLowerCase()) ||
      tool.aliases?.some(alias =>
        alias.toLowerCase().includes(search.toLowerCase()),
      ) ||
      description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className={styles.page}>
      <Text variant="body-medium" className={styles.intro}>
        {t('welcomePage.introText')}
      </Text>
      <Text variant="body-medium" className={styles.intro}>
        {t('welcomePage.secondText')}
      </Text>
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          placeholder={t('welcomePage.search')}
          aria-label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <RiSearchLine size={16} color="var(--bui-fg-secondary)" />
      </div>
      {filteredTools.length === 0 && (
        <Alert
          status="warning"
          description={t('welcomePage.noToolsFound')}
          className={styles.noTools}
        />
      )}
      <div className={styles.grid}>
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className={styles.card}
            onClick={() => (window.location.hash = tool.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.location.hash = tool.id;
              }
            }}
          >
            <span className={styles.cardCategory}>
              {t(
                `tool.category.${(
                  tool.category ?? 'miscellaneous'
                ).toLowerCase()}`,
                { defaultValue: tool.category ?? 'Miscellaneous' },
              )}
            </span>
            <Text variant="title-small" className={styles.cardTitle}>
              {t(`tool.${tool.id}.name`, { defaultValue: tool.name })}
            </Text>
            <Text variant="body-small" className={styles.cardDescription}>
              {t(`tool.${tool.id}.description`, {
                defaultValue: tool.description,
              })}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
