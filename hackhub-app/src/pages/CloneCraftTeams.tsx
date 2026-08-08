import { useState } from 'react'
import { Container, Title, Text, Card, Stack, TextInput, Group, SimpleGrid, Badge } from '@mantine/core'
import { IconSearch, IconUsers } from '@tabler/icons-react'
import { teams as allTeamsRaw } from '../data/clonecraftData'

export function CloneCraftTeams() {
  const [search, setSearch] = useState('')
  
  // Get unique teams and sort them alphabetically
  const uniqueTeams = Array.from(new Set(allTeamsRaw)).sort((a, b) => a.localeCompare(b))

  const filteredTeams = uniqueTeams.filter(team => 
    team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} variant="gradient" gradient={{ from: 'grape', to: 'pink' }}>
            Clone Craft Teams
          </Title>
          <Text c="dimmed" size="lg" mt="sm">
            All registered teams for the event
          </Text>
        </div>

        <Card withBorder radius="lg" shadow="sm">
          <Group justify="space-between" mb="lg">
            <Group>
              <Title order={3}>Participating Teams</Title>
              <Badge size="lg" variant="light" color="grape">
                {uniqueTeams.length} Total
              </Badge>
            </Group>
            <TextInput
              placeholder="Search team name..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: '100%', sm: 300 }}
            />
          </Group>

          {filteredTeams.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
              {filteredTeams.map((team, i) => (
                <Card key={i} withBorder padding="md" radius="md">
                  <Group wrap="nowrap">
                    <IconUsers size={24} style={{ color: 'var(--mantine-color-gray-5)' }} />
                    <Text fw={500} truncate>
                      {team}
                    </Text>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" fs="italic" ta="center" py="xl">
              No teams found matching your search.
            </Text>
          )}
        </Card>
      </Stack>
    </Container>
  )
}
