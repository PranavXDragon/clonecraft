import { useState } from 'react'
import { Container, Title, Text, Table, Card, Group, Badge, Button, Progress, Stack } from '@mantine/core'
import { IconRefresh, IconExternalLink } from '@tabler/icons-react'

// Mock submissions data
type SubmissionStatus = 'PENDING' | 'CHECKING' | 'CHECKED'

interface Submission {
  id: string
  teamName: string
  website: string
  challenge: string
  url: string
  status: SubmissionStatus
  matchPercentage: number | null
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    teamName: 'Pixel Pirates',
    website: 'Netflix',
    challenge: 'Add Dark Mode',
    url: 'https://github.com/pixel-pirates/netflix-clone',
    status: 'PENDING',
    matchPercentage: null
  },
  {
    id: 'sub-2',
    teamName: 'Byte Me',
    website: 'Spotify',
    challenge: 'Include 3D animations',
    url: 'https://github.com/byteme/spotify-clone',
    status: 'CHECKED',
    matchPercentage: 87
  },
  {
    id: 'sub-3',
    teamName: 'Code Wizards',
    website: 'Twitter',
    challenge: 'No CSS Frameworks',
    url: 'https://github.com/code-wizards/twitter-clone',
    status: 'PENDING',
    matchPercentage: null
  }
]

export function CloneCraftAdmin() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS)

  const handleCheckMatch = (id: string) => {
    // Simulate the AI model checking process
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: 'CHECKING' } : sub)
    )

    setTimeout(() => {
      setSubmissions(prev => 
        prev.map(sub => {
          if (sub.id === id) {
            // Placeholder: Generate random match percentage
            const randomMatch = Math.floor(Math.random() * 40) + 60 // 60-100%
            return { ...sub, status: 'CHECKED', matchPercentage: randomMatch }
          }
          return sub
        })
      )
    }, 2000)
  }

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'PENDING': return <Badge color="gray">Pending</Badge>
      case 'CHECKING': return <Badge color="blue" className="animate-pulse">Checking...</Badge>
      case 'CHECKED': return <Badge color="green">Checked</Badge>
    }
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={1}>Clone Craft Admin</Title>
            <Text c="dimmed" mt="xs">
              Review team submissions and run the clone match AI model
            </Text>
          </div>
          <Button leftSection={<IconRefresh size={16} />} variant="light">
            Refresh
          </Button>
        </Group>

        <Card withBorder radius="lg" shadow="sm">
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Team</Table.Th>
                  <Table.Th>Allotted Website</Table.Th>
                  <Table.Th>Challenge</Table.Th>
                  <Table.Th>Submission URL</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Clone Match %</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {submissions.map((sub) => (
                  <Table.Tr key={sub.id}>
                    <Table.Td fw={500}>{sub.teamName}</Table.Td>
                    <Table.Td>{sub.website}</Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{sub.challenge}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="sm" component="a" href={sub.url} target="_blank" c="blue" style={{ textDecoration: 'none' }}>
                          View Code
                        </Text>
                        <IconExternalLink size={14} color="var(--mantine-color-blue-6)" />
                      </Group>
                    </Table.Td>
                    <Table.Td>{getStatusBadge(sub.status)}</Table.Td>
                    <Table.Td>
                      {sub.status === 'CHECKED' && sub.matchPercentage !== null ? (
                        <Group gap="sm">
                          <Text size="sm" fw={600} w={40}>{sub.matchPercentage}%</Text>
                          <Progress 
                            value={sub.matchPercentage} 
                            color={sub.matchPercentage > 80 ? 'green' : sub.matchPercentage > 60 ? 'yellow' : 'red'} 
                            style={{ flex: 1, minWidth: '100px' }}
                          />
                        </Group>
                      ) : (
                        <Text size="sm" c="dimmed">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Button
                        size="xs"
                        variant={sub.status === 'PENDING' ? 'filled' : 'light'}
                        onClick={() => handleCheckMatch(sub.id)}
                        loading={sub.status === 'CHECKING'}
                        disabled={sub.status === 'CHECKED'}
                      >
                        {sub.status === 'CHECKED' ? 'Re-check' : 'Check Match'}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Stack>
    </Container>
  )
}
