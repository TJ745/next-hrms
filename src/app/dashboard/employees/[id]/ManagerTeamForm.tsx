import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface Props {
  employee: any;
}

export default function ManagerTeamTab({ employee }: Props) {
  const manager = employee.manager;
  const team = employee.team || [];

  return (
    <div>
      {/* MANAGER */}
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle>Manager</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {manager ? (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={manager.image || ""} />
                <AvatarFallback>
                  {manager.user?.name?.[0] || "M"}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{manager.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {manager.user?.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No manager&apos;s assigned
            </p>
          )}
        </CardContent>
      </Card>

      {/* TEAM */}
      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between h-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Member&apos;s ({team.length})
          </CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {team.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No team member&apos;s assigned
            </p>
          ) : (
            <div className="space-y-3">
              {team.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.image || ""} />
                      <AvatarFallback>{member.user?.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">{member.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.jobTitle || "—"}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
