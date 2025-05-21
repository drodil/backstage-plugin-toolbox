import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { useToolboxTranslation } from '../../hooks';

export type WelcomePageProps = {
  tools: Tool[];
};

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const { t } = useToolboxTranslation();

  return (
    <Box>
      <Typography mt={1}>{t('welcomePage.introText')}</Typography>
      <Typography mt={1}>{t('welcomePage.secondText')}</Typography>
      <Grid
        container
        sx={{ p: 0, mx: '-8px', mb: '-8px', mt: 1 }}
        alignContent="center"
      >
        {tools.map(tool => {
          return (
            <Grid
              item
              key={tool.id}
              xs={3}
              sx={{ p: '8px', pt: '8px !important', pl: '8px !important' }}
            >
              <Card
                onClick={() => (window.location.hash = tool.id)}
                sx={theme => ({
                  cursor: 'pointer',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  height: '100%',
                  '&:hover': {
                    borderColor: theme.palette.primary.light,
                  },
                })}
              >
                <CardContent sx={{ p: '16px', pb: '16px !important' }}>
                  <Typography color="textSecondary" gutterBottom>
                    {t(
                      `tool.category.${(
                        tool.category ?? 'miscellaneous'
                      ).toLowerCase()}`,
                      {
                        defaultValue: tool.category ?? 'Miscellaneous',
                      },
                    )}
                  </Typography>
                  <Typography variant="h6">
                    {t(`tool.${tool.id}.name`, { defaultValue: tool.name })}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {t(`tool.${tool.id}.description`, {
                      defaultValue: tool.description,
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
